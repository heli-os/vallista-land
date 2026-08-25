import { graphql, useStaticQuery } from 'gatsby'
import { FC } from 'react'

import { StaticQuery } from '../../types/type'
import { toAbsoluteUrl } from '../../utils/seo-url'

export type SeoPageType = 'home' | 'post' | 'collection' | 'profile' | 'about' | 'bookChapter' | 'page'

interface BreadcrumbItem {
  name: string
  url: string
}

interface CollectionItem {
  name: string
  url: string
}

interface SeoProps {
  name?: string
  seoTitle?: string
  description?: string
  image?: string
  pageType?: SeoPageType
  date?: string
  dateModified?: string
  tags?: string[]
  timeToRead?: number
  breadcrumbs?: BreadcrumbItem[]
  collectionItems?: CollectionItem[]
  bookName?: string
  bookUrl?: string
  pathname?: string
  noTemplate?: boolean
}

export const Seo: FC<SeoProps> = ({
  name,
  seoTitle,
  description,
  image,
  pageType = 'page',
  date,
  dateModified,
  tags,
  timeToRead,
  breadcrumbs,
  collectionItems,
  bookName,
  bookUrl,
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
    knowsAbout,
    worksFor
  } = site.siteMetadata

  const editorialTitle = name || defaultTitle
  const searchTitle = seoTitle || editorialTitle
  const seoDescription = description || defaultDescription
  const pageUrl = toAbsoluteUrl(pathname)
  const imageUrl = toAbsoluteUrl(image || defaultImage)
  const fullTitle = noTemplate ? searchTitle : titleTemplate.replace('%s', searchTitle)
  const authorUrl = toAbsoluteUrl('/resume/')
  const personId = toAbsoluteUrl('/#person')
  const organizationId = toAbsoluteUrl('/#organization')
  const websiteId = toAbsoluteUrl('/#website')
  const blogId = toAbsoluteUrl('/#blog')
  const isArticle = pageType === 'post' || pageType === 'bookChapter'

  const personEntity = {
    '@type': 'Person',
    '@id': personId,
    name: 'Theo',
    alternateName: '진태양',
    url: authorUrl,
    ...(jobTitle ? { jobTitle } : {}),
    ...(knowsAbout && knowsAbout.length > 0 ? { knowsAbout } : {}),
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
    ...(worksFor
      ? {
          worksFor: {
            '@type': 'Organization',
            name: worksFor.name,
            url: worksFor.url
          }
        }
      : {})
  }

  const organizationEntity = {
    '@type': 'Organization',
    '@id': organizationId,
    name: '테오 블로그',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl('/open-graph.jpeg')
    },
    founder: { '@id': personId }
  }

  const pageEntity = (() => {
    const common = {
      '@context': 'https://schema.org',
      name: editorialTitle,
      description: seoDescription,
      url: pageUrl,
      inLanguage: 'ko-KR'
    }

    if (pageType === 'home') {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          personEntity,
          organizationEntity,
          {
            '@type': 'WebSite',
            '@id': websiteId,
            name: '테오 블로그',
            url: siteUrl,
            description: defaultDescription,
            inLanguage: 'ko-KR',
            publisher: { '@id': organizationId },
            author: { '@id': personId },
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${toAbsoluteUrl('/posts/')}?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'Blog',
            '@id': blogId,
            name: '테오 블로그',
            url: siteUrl,
            description: defaultDescription,
            inLanguage: 'ko-KR',
            author: { '@id': personId },
            publisher: { '@id': organizationId }
          }
        ]
      }
    }

    if (pageType === 'post') {
      return {
        ...common,
        '@type': 'BlogPosting',
        headline: editorialTitle,
        image: imageUrl,
        datePublished: date,
        dateModified: dateModified || date,
        author: { '@type': 'Person', '@id': personId, name: 'Theo', url: authorUrl },
        publisher: { '@type': 'Organization', '@id': organizationId, name: '테오 블로그' },
        isPartOf: { '@id': blogId },
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        ...(tags && tags.length > 0 ? { keywords: tags.join(', '), articleSection: tags[0] } : {}),
        ...(timeToRead ? { timeRequired: `PT${timeToRead}M` } : {})
      }
    }

    if (pageType === 'collection') {
      return {
        ...common,
        '@type': 'CollectionPage',
        ...(collectionItems && collectionItems.length > 0
          ? {
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: collectionItems.length,
                itemListElement: collectionItems.map((item, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: item.name,
                  url: toAbsoluteUrl(item.url)
                }))
              }
            }
          : {})
      }
    }

    if (pageType === 'profile') {
      return {
        ...common,
        '@type': 'ProfilePage',
        mainEntity: personEntity
      }
    }

    // 소개 페이지는 Person을 다시 정의하지 않고 홈에서 선언한 엔티티를 참조한다.
    if (pageType === 'about') {
      return {
        ...common,
        '@type': 'AboutPage',
        mainEntity: { '@id': personId }
      }
    }

    if (pageType === 'bookChapter') {
      return {
        ...common,
        '@type': 'Article',
        headline: editorialTitle,
        image: imageUrl,
        datePublished: date,
        dateModified: dateModified || date,
        author: { '@type': 'Person', '@id': personId, name: 'Theo', url: authorUrl },
        publisher: { '@type': 'Organization', '@id': organizationId, name: '테오 블로그' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        ...(bookName
          ? {
              isPartOf: {
                '@type': 'Book',
                name: bookName,
                url: toAbsoluteUrl(bookUrl || '/books/')
              }
            }
          : {})
      }
    }

    return { ...common, '@type': 'WebPage' }
  })()

  const breadcrumbJsonLd =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: toAbsoluteUrl(item.url)
          }))
        }
      : null

  return (
    <>
      <title>{fullTitle}</title>
      <meta name='description' content={seoDescription} />
      <meta name='image' content={imageUrl} />
      <link rel='canonical' href={pageUrl} />
      <link rel='preconnect' href='https://www.googletagmanager.com' crossOrigin='anonymous' />
      <link rel='dns-prefetch' href='https://www.google-analytics.com' />
      <meta property='og:url' content={pageUrl} />
      <meta property='og:type' content={isArticle ? 'article' : 'website'} />
      <meta property='og:title' content={editorialTitle} />
      <meta property='og:description' content={seoDescription} />
      <meta property='og:image' content={imageUrl} />
      <meta property='og:locale' content='ko_KR' />
      <meta property='og:site_name' content='테오 블로그' />
      {isArticle && date && <meta property='article:published_time' content={date} />}
      {isArticle && (dateModified || date) && <meta property='article:modified_time' content={dateModified || date} />}
      {isArticle && <meta property='article:author' content={authorUrl} />}
      {pageType === 'post' && tags && tags.length > 0 && <meta property='article:section' content={tags[0]} />}
      {pageType === 'post' && tags && tags.map((tag) => <meta key={tag} property='article:tag' content={tag} />)}
      <meta name='twitter:card' content='summary_large_image' />
      {twitterUsername && <meta name='twitter:creator' content={twitterUsername} />}
      <meta name='twitter:title' content={editorialTitle} />
      <meta name='twitter:description' content={seoDescription} />
      <meta name='twitter:image' content={imageUrl} />
      <script type='application/ld+json'>{JSON.stringify(pageEntity)}</script>
      {breadcrumbJsonLd && <script type='application/ld+json'>{JSON.stringify(breadcrumbJsonLd)}</script>}
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
        worksFor {
          name
          url
        }
      }
    }
  }
`
