import NodeCache from 'node-cache';
import { promises as fs } from 'fs';
import path from 'path';

// Types
interface Category {
  name: string;
  key: string;
  itemKey: string;
  linkPrefix: string;
}

interface SitemapImage {
  loc: string;
  title?: string;
}

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: SitemapImage[];
}

interface Item {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  image?: string;
  imageAlt?: string;
  [key: string]: any;
}

// Category Cache Class
class CategoryCache {
  private cache: NodeCache;
  private readonly defaultTTL = 300; // 5 minutes

  constructor() {
    this.cache = new NodeCache({
      stdTTL: this.defaultTTL,
      checkperiod: 60,
      useClones: false, // Improve performance
    });
  }

  async getOrFetch(
    category: Category,
    fetcher: () => Promise<Item[]>
  ): Promise<Item[]> {
    const cacheKey = `category_${category.key}`;

    // Check cache first
    const cachedData = this.cache.get<Item[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const data = await fetcher();

      // Validate data
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }

      // Cache valid data
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching category "${category.key}":`, error);

      // Return stale data if available
      const staleData = this.cache.get<Item[]>(cacheKey);
      if (staleData) {
        console.warn(`Using stale cache for "${category.key}"`);
        return staleData;
      }

      return [];
    }
  }
}

// Configuration
const CATEGORIES: Category[] = [
  { name: 'Airdrops', key: 'airdrops', itemKey: 'title', linkPrefix: '/airdrops/' },
  { name: 'Games', key: 'games', itemKey: 'title', linkPrefix: '/games/' },
  { name: 'Farming', key: 'farm-tokens', itemKey: 'tokenName', linkPrefix: '/farm-tokens/' },
  {name: 'Platforms', key: 'platforms', itemKey: 'title', linkPrefix: '/platforms/'},
  { name: 'Academy', key: 'academy', itemKey: 'postHeading', linkPrefix: '/academy/' },
];

const STATIC_ROUTES = ['', '/about', '/contact'];

// Main Sitemap Generator
export default async function sitemap(): Promise<SitemapEntry[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.web3fruity.com';
  const cache = new CategoryCache();

  // Generate static routes
  const staticRoutes = generateStaticRoutes(baseUrl);
  
  // Generate dynamic routes
  const dynamicRoutes = await generateDynamicRoutes(baseUrl, cache);
  
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Handle large sitemaps
  if (allRoutes.length > 50000) {
    return splitSitemaps(allRoutes, baseUrl);
  }

  return allRoutes;
}

// Helper Functions
async function fetchCategoryData(category: Category, cache: CategoryCache): Promise<Item[]> {
  return cache.getOrFetch(category, async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${category.key}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  });
}

function generateStaticRoutes(baseUrl: string): SitemapEntry[] {
  return [
    ...STATIC_ROUTES,
    ...CATEGORIES.map(cat => cat.linkPrefix.slice(0, -1))
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.9,
  }));
}

async function generateDynamicRoutes(baseUrl: string, cache: CategoryCache): Promise<SitemapEntry[]> {
  const routes = await Promise.all(
    CATEGORIES.map(async (category) => {
      const items = await fetchCategoryData(category, cache);
      return items.map((item): SitemapEntry => ({
        url: `${baseUrl}${category.linkPrefix}${item.slug}`,
        lastModified: item.updatedAt || item.createdAt || new Date().toISOString(),
        changeFrequency: getCategoryChangeFreq(category.key),
        priority: getCategoryPriority(category.key),
        ...(item.image && {
          images: [{
            loc: item.image,
            title: item.imageAlt || item[category.itemKey],
          }]
        })
      }));
    })
  );
  
  return routes.flat();
}

function getCategoryChangeFreq(categoryKey: string): SitemapEntry['changeFrequency'] {
  const freqMap: Record<string, SitemapEntry['changeFrequency']> = {
    airdrops: 'hourly',
    games: 'daily',
    farmTokens: 'daily',
    academy: 'weekly',
  };
  return freqMap[categoryKey] || 'weekly';
}

function getCategoryPriority(categoryKey: string): number {
  const priorities: Record<string, number> = {
    airdrops: 0.9,
    games: 0.8,
    farmTokens: 0.8,
    academy: 0.7,
  };
  return priorities[categoryKey] || 0.5;
}

// XML Generation and File Management
function escapeXml(unsafe: string): string {
  const replacements: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  };
  return unsafe.replace(/[<>&'"]/g, (c) => replacements[c] || c);
}

//generate sitemap.xml
function generateSitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(entry => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>${entry.images ? entry.images.map(image => `
    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>${image.title ? `
      <image:title>${escapeXml(image.title)}</image:title>` : ''}
    </image:image>`).join('') : ''}
  </url>`).join('\n')}
</urlset>`;
}

function generateSitemapIndex(sitemaps: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${escapeXml(sitemap.url)}</loc>
    <lastmod>${sitemap.lastModified}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
}

async function writeSitemapFile(entries: SitemapEntry[], fileName: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'public', fileName);
  
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    const xml = fileName.includes('sitemap-index') 
      ? generateSitemapIndex(entries)
      : generateSitemapXml(entries);
    
    await fs.writeFile(filePath, xml, 'utf8');
    console.log(`Successfully wrote ${fileName}`);
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw error;
  }
}

function chunk<T>(array: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(array.length / size) },
    (_, i) => array.slice(i * size, i * size + size)
  );
}

async function splitSitemaps(entries: SitemapEntry[], baseUrl: string): Promise<SitemapEntry[]> {
  const chunks = chunk(entries, 45000); // Slightly lower than 50k for safety
  
  // Write individual sitemaps
  await Promise.all(
    chunks.map(async (chunk, i) => {
      await writeSitemapFile(chunk, `sitemap-${i + 1}.xml`);
    })
  );
  
  // Create index entries
  const indexEntries = chunks.map((_, i) => ({
    url: `${baseUrl}/sitemap-${i + 1}.xml`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));
  
  await writeSitemapFile(indexEntries, 'sitemap-index.xml');
  
  return indexEntries;
}