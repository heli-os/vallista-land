import { useLocation } from '@reach/router'
import { useStaticQuery, graphql } from 'gatsby'
import { VFC } from 'react'
import { Helmet } from 'react-helmet'

import { StaticQuery } from '../../types/type'

interface BreadcrumbItem {
  name: string
  url: string
}

interface SeoProps {
  name?: string
  description?: string
  image?: string
  isPost?: boolean
  date?: string
  dateModified?: string
  tags?: string[]
  timeToRead?: number
  breadcrumbs?: BreadcrumbItem[]
}

export const Seo: VFC<SeoProps> = ({
  name,
  description,
  image,
  isPost = false,
  date,
  dateModified,
  tags,
  timeToRead,
  breadcrumbs
}) => {
  const location = useLocation()
  const { site } = useStaticQuery<StaticQuery>(query)
  const { defaultTitle, titleTemplate, defaultDescription, siteUrl, defaultImage, twitterUsername } = site.siteMetadata

  const seo = {
    title: name || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${decodeURIComponent(location.pathname)}`
  }

  const blogPostingJsonLd = isPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: seo.title,
        description: seo.description,
        image: seo.image,
        url: seo.url,
        datePublished: date,
        dateModified: dateModified || date,
        author: {
          '@type': 'Person',
          name: 'Theo',
          url: siteUrl
        },
        publisher: {
          '@type': 'Organization',
          name: '테오 블로그',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/open-graph.jpeg`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': seo.url
        },
        ...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
        ...(timeToRead ? { timeRequired: `PT${timeToRead}M` } : {})
      }
    : null

  const webSiteJsonLd = !isPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '테오 블로그',
        url: siteUrl,
        description: defaultDescription,
        author: {
          '@type': 'Person',
          name: 'Theo'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/posts/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    : null

  const breadcrumbJsonLd =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        }
      : null

  return (
    <Helmet title={seo.title} titleTemplate={titleTemplate}>
      <title>{seo.title}</title>
      <meta name='description' content={seo.description} />
      <meta name='image' content={seo.image} />
      <link rel='canonical' href={seo.url} />
      {seo.url && <meta property='og:url' content={seo.url} />}
      <meta property='og:type' content={isPost ? 'article' : 'website'} />
      {seo.title && <meta property='og:title' content={seo.title} />}
      <meta property='og:description' content={seo.description} />
      {seo.image && <meta property='og:image' content={seo.image} />}
      <meta property='og:locale' content='ko_KR' />
      <meta property='og:site_name' content='테오 블로그' />
      {isPost && date && <meta property='article:published_time' content={date} />}
      {isPost && (dateModified || date) && (
        <meta property='article:modified_time' content={dateModified || date} />
      )}
      {isPost && <meta property='article:author' content={siteUrl} />}
      {isPost && tags && tags.length > 0 && <meta property='article:section' content={tags[0]} />}
      {isPost && tags && tags.map((tag) => <meta key={tag} property='article:tag' content={tag} />)}
      <meta name='twitter:card' content='summary_large_image' />
      {twitterUsername && <meta name='twitter:creator' content={twitterUsername} />}
      {seo.title && <meta name='twitter:title' content={seo.title} />}
      {seo.description && <meta name='twitter:description' content={seo.description} />}
      {seo.image && <meta name='twitter:image' content={seo.image} />}
      {blogPostingJsonLd && (
        <script type='application/ld+json'>{JSON.stringify(blogPostingJsonLd)}</script>
      )}
      {webSiteJsonLd && (
        <script type='application/ld+json'>{JSON.stringify(webSiteJsonLd)}</script>
      )}
      {breadcrumbJsonLd && (
        <script type='application/ld+json'>{JSON.stringify(breadcrumbJsonLd)}</script>
      )}
    </Helmet>
  )
}
export default Seo

const query = graphql`
  query SeoQuery {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl: url
        defaultImage: image
        twitterUsername
      }
    }
  }
`
