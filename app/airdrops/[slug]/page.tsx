// app/academy/[slug]/page.tsx
import { Metadata } from 'next'
import AirdropGuide from './airdrop-guide'

// This is a server component that handles metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const airdrop = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/airdrops/${params.slug}`).then(res => res.json())
  return {
    title: airdrop.title,
    description: airdrop.excerpt,
    keywords: airdrop.keywords,
    /* authors: [{ name: airdrop.author }], */
    openGraph: {
      title: airdrop.title,
      description: `Take part in the ${airdrop.title} and earn free tokens for your participation. Don't miss out on this opportunity`,
      images: [airdrop.logo],
      type: 'article',
      publishedTime: airdrop.timestamp,
      /* authors: [airdrop.author], */
      tags: airdrop.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: airdrop.title,
      description: `Take part in the ${airdrop.title} and earn free tokens for your participation. Don't miss out on this opportunity`,
      images: [airdrop.logo],
      /* creator: airdrop.author, */
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.web3fruity.com/airdrops/${params.slug}`,
    },
  }
}

// Server component that passes data to client component
export default async function AcademyairdropPage({ params }) {
  // Fetch the initial data server-side
  const initialData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/airdrops/${params.slug}`).then(res => res.json())
  //console.log('initial data', initialData);
  return <AirdropGuide initialData={initialData} slug={params.slug} />
}