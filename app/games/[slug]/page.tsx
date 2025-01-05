import { Metadata } from 'next'
import GameDetails from './GameDetails'
import axios from 'axios'

// This is a server component that handles metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const game = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/games/${params.slug}`).then(res => res.data)
  return {
    title: game.title,
    description: game.excerpt,
    keywords: game.keywords,
    openGraph: {
      title: game.title,
      description: game.description,
      images: [game.logo],
      type: 'article',
      publishedTime: game.timestamp,
      tags: game.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description: game.description,
      images: [game.logo],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.web3fruity.com/games/${params.slug}`,
    },
  }
}

// Server component that passes data to client component
export default async function GamePage({ params }) {
  // Fetch the initial data server-side
  const initialData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/games/${params.slug}`).then(res => res.data)
  //console.log('initial data', initialData)
  return <GameDetails initialData={initialData} />
}
