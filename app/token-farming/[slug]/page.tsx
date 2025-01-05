// app/academy/[slug]/page.tsx
import { Metadata } from 'next'
import TokenFarmingGuide from './tokenFarmingGuide'
import axios from 'axios'

// This is a server component that handles metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const farmToken = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/farm-tokens/${params.slug}`).then(res => res.data)
  return {
    title: farmToken.tokenName,
    description: farmToken.description,
    keywords: farmToken.keywords,
    /* authors: [{ name: farmToken.author }], */
    openGraph: {
      title: farmToken.tokenName,
      description: farmToken.description,
      images: [farmToken.logo],
      type: 'article',
      publishedTime: farmToken.timestamp,
      /* authors: [farmToken.author], */
      tags: farmToken.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: farmToken.tokenName,
      description: farmToken.description,
      images: [farmToken.logo],
      /* creator: farmToken.author, */
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.web3fruity.com/farm-tokens/${params.slug}`,
    },
  }
}

// Server component that passes data to client component
export default async function FarmTokenPage({ params }) {
  // Fetch the initial data server-side
  const initialData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/farm-tokens/${params.slug}`).then(res => res.data)
  //console.log('initial data', initialData);
  return <TokenFarmingGuide initialData={initialData} />
}