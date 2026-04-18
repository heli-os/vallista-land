import { useStaticQuery, graphql } from 'gatsby'
import { FC } from 'react'

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
  pathname?: string
  noTemplate?: boolean
}

export const Seo: FC<SeoProps> = ({
  name,
  description,
  image,
  isPost = false,
  date,
  dateModified,
  tags,
  timeToRead,
  breadcrumbs,
  pathname = '/',
  noTemplate = false
}) => {
  const { site } = useStaticQuery<StaticQuery>(query)
  const {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
    sameAs,
    jobTitle,
    knowsAbout
  } = site.siteMetadata

  const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`
  const seo = {
    title: name || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${normalizedPathname}`
  }

  const fullTitle = noTemplate ? seo.title : titleTemplate.replace('%s', seo.title)
  const authorUrl = `${siteUrl}/resume/`

  const personEntity = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Theo',
    alternateName: '진태양',
    url: authorUrl,
    ...(jobTitle ? { jobTitle } : {}),
    ...(knowsAbout && knowsAbout.length > 0 ? { knowsAbout } : {}),
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {})
  }

  const organizationEntity = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: '테오 블로그',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/open-graph.jpeg`
    },
    founder: { '@id': `${siteUrl}/#person` }
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
          '@id': `${siteUrl}/#person`,
          name: 'Theo',
          url: authorUrl,
          ...(sameAs && sameAs.length > 0 ? { sameAs } : {})
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
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
        ...(tags && tags.length > 0 ? { keywords: tags.join(', '), articleSection: tags[0] } : {}),
        ...(timeToRead ? { timeRequired: `PT${timeToRead}M` } : {})
      }
    : null

  const webSiteJsonLd = !isPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: '테오 블로그',
        url: siteUrl,
        description: defaultDescription,
        inLanguage: 'ko',
        publisher: { '@id': `${siteUrl}/#organization` },
        author: { '@id': `${siteUrl}/#person` },
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

  // 홈 경로에서만 Blog + Organization + Person 엔티티를 함께 노출한다 (엔티티 사이트 그래프 신호)
  const isHome = normalizedPathname === '/'
  const blogEntityJsonLd = isHome
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          personEntity,
          organizationEntity,
          {
            '@type': 'Blog',
            '@id': `${siteUrl}/#blog`,
            name: '테오 블로그',
            url: siteUrl,
            description: defaultDescription,
            inLanguage: 'ko',
            author: { '@id': `${siteUrl}/#person` },
            publisher: { '@id': `${siteUrl}/#organization` }
          }
        ]
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
    <>
      <title>{fullTitle}</title>
      <meta name='description' content={seo.description} />
      <meta name='image' content={seo.image} />
      <link rel='canonical' href={seo.url} />
      <link rel='preconnect' href='https://www.googletagmanager.com' crossOrigin='anonymous' />
      <link rel='dns-prefetch' href='https://www.google-analytics.com' />
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
      {isPost && <meta property='article:author' content={authorUrl} />}
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
      {blogEntityJsonLd && (
        <script type='application/ld+json'>{JSON.stringify(blogEntityJsonLd)}</script>
      )}
      {breadcrumbJsonLd && (
        <script type='application/ld+json'>{JSON.stringify(breadcrumbJsonLd)}</script>
      )}
    </>
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
        sameAs
        jobTitle
        knowsAbout
      }
    }
  }
`
