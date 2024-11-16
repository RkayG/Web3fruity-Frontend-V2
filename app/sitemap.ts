// app/sitemap.ts
interface Category {
  name: string;
  key: string;
  itemKey: string;
  linkPrefix: string;
}

interface Item {
  [key: string]: any;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  image?: string;    // Image URL if present
  imageAlt?: string; // Image alt text if present
}

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: Array<{
    loc: string;
    title?: string;
  }>;
}

async function fetchCategoryData(category: Category): Promise<Item[]> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/${category.key}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Category-specific error handling
    switch (category.key) {
      case 'airdrops':
        console.error('🚨 Airdrops fetch failed - critical for time-sensitive content:', error);
        // You might want to notify your error tracking service here
        break;
      case 'academyArticles':
        console.warn('📚 Academy articles fetch failed - using cached data if available:', error);
        // Could implement fallback to cached data here
        break;
      default:
        console.error(`Error fetching ${category.key}:`, error);
    }
    
    // Return empty array or cached data depending on category
    return [];
  }
}

export default async function sitemap(): Promise<SitemapEntry[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.web3fruity.com';

  const categories: Category[] = [
    { name: 'Airdrops', key: 'airdrops', itemKey: 'title', linkPrefix: '/airdrops/' },
    { name: 'Games', key: 'games', itemKey: 'title', linkPrefix: '/games/' },
    { name: 'Farming', key: 'farm-tokens', itemKey: 'tokenName', linkPrefix: '/farm-tokens/' },
    { name: 'Academy', key: 'academy', itemKey: 'postHeading', linkPrefix: '/academy/' },
  ];

  // Static routes
  const staticRoutes: SitemapEntry[] = [
    '',
    '/about',
    '/contact',
    ...categories.map(cat => cat.linkPrefix.slice(0, -1))
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.9,
  }));

  // Fetch and process dynamic routes
  const dynamicRoutes = await Promise.all(
    categories.map(async (category) => {
      const items = await fetchCategoryData(category);
      
      return items.map((item): SitemapEntry => {
        // Base sitemap entry
        const entry: SitemapEntry = {
          url: `${baseUrl}${category.linkPrefix}${item.slug}`,
          lastModified: item.updatedAt || item.createdAt || new Date().toISOString(),
          changeFrequency: getCategoryChangeFreq(category.key),
          priority: getCategoryPriority(category.key),
        };

        // Add images if present
        if (item.image) {
          entry.images = [{
            loc: item.image,
            title: item.imageAlt || item[category.itemKey],
          }];
        }

        return entry;
      });
    })
  );

  return [...staticRoutes, ...dynamicRoutes.flat()];
}

function getCategoryChangeFreq(categoryKey: string): SitemapEntry['changeFrequency'] {
  const freqMap: Record<string, SitemapEntry['changeFrequency']> = {
    airdrops: 'always',
    games: 'daily',
    tokenFarming: 'daily',
    academyArticles: 'weekly',
  };
  return freqMap[categoryKey] || 'weekly';
}

function getCategoryPriority(categoryKey: string): number {
  const priorities: Record<string, number> = {
    airdrops: 0.9,
    games: 0.8,
    tokenFarming: 0.8,
    academyArticles: 0.7,
  };
  return priorities[categoryKey] ?? 0.5;
}

// Optional: Robots.txt
export function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}