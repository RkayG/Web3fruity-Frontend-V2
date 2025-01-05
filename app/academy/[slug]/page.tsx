// app/academy/[slug]/page.tsx
import { Metadata } from 'next'
import AcademyArticleContent from './academy-article-content'
import axios from 'axios'

// This is a server component that handles metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academy/${params.slug}`).then(res => res.data)
  return {
    title: article.postHeading,
    description: article.excerpt,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.postHeading,
      description: article.excerpt,
      images: [article.imageLink],
      type: 'article',
      publishedTime: article.timestamp,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.postHeading,
      description: article.excerpt,
      images: [article.imageLink],
      creator: article.author,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.web3fruity.com/academy/${params.slug}`,
    },
  }
}

// Server component that passes data to client component
export default async function AcademyArticlePage({ params }) {
  // Fetch the initial data server-side
  const initialData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academy/${params.slug}`).then(res => res.data)
  return <AcademyArticleContent initialData={initialData}/>
}