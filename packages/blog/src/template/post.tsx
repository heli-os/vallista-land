import { graphql, HeadProps } from 'gatsby'
import { useCallback, FC } from 'react'
import { PageProps, PostQuery } from 'types/type'

import { AdSense } from '../components/AdSense'
import { Comment } from '../components/Comment'
import { Markdown } from '../components/Markdown'
import { PostHeader } from '../components/PostHeader'
import { Seo } from '../components/Seo'
import { Series } from '../components/Series'
import { useConfig } from '../hooks/useConfig'

const Post: FC<PageProps<PostQuery>> = (props) => {
  const { profile } = useConfig()
  const { allMarkdownRemark } = props.data
  const { nodes, group: seriesGroup } = allMarkdownRemark
  const { timeToRead, html, excerpt } = props.data.markdownRemark
  const { title, date, image, tags, series, description: frontmatterDescription } = props.data.markdownRemark.frontmatter

  const cachedFilterSeries = useCallback(getFilteredSeries, [props.data])

  return (
    <div>
      <PostHeader
        title={title}
        date={date}
        image={image?.publicURL}
        tags={tags}
        timeToRead={timeToRead}
        author={profile.author}
      >
        {series && seriesGroup && (
          <Series name={series} currentSlug={props.data.markdownRemark.fields.slug} posts={cachedFilterSeries()} />
        )}
      </PostHeader>
      <Markdown html={html} />
      <AdSense slotId='7216625942' />
      <section id='comments'></section>
      <Comment />
    </div>
  )

  function getFilteredSeries(): { name: string; timeToRead: number; slug: string }[] {
    return nodes
      .filter((it) => it.frontmatter.series)
      .filter((it) => it.frontmatter.series === series)
      .map((it) => ({ name: it.frontmatter.title, timeToRead: it.timeToRead, slug: it.fields.slug }))
      .reverse()
  }
}

export default Post

const SITE_URL = 'https://dataportal.kr'

export const Head = ({ data, location }: HeadProps<PostQuery>) => {
  const { title, date, image, tags, description: frontmatterDescription } = data.markdownRemark.frontmatter
  const { timeToRead, excerpt } = data.markdownRemark
  const lastModified = data.markdownRemark.fields?.lastModified

  const breadcrumbs = [
    { name: '홈', url: `${SITE_URL}/` },
    { name: '글 목록', url: `${SITE_URL}/posts/` },
    { name: title, url: `${SITE_URL}${encodeURI(data.markdownRemark.fields.slug)}` }
  ]

  return (
    <Seo
      name={title}
      description={frontmatterDescription || excerpt}
      image={image?.publicURL}
      isPost
      date={date}
      dateModified={lastModified}
      tags={tags}
      timeToRead={timeToRead}
      breadcrumbs={breadcrumbs}
      pathname={location.pathname}
    />
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fields: { contentType: { eq: "posts" } } }
    ) {
      nodes {
        fields {
          slug
        }
        timeToRead
        frontmatter {
          title
          series
        }
      }
      group(field: { frontmatter: { series: SELECT } }) {
        fieldValue
        totalCount
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
        lastModified
      }
      timeToRead
      frontmatter {
        title
        description
        tags
        date
        image {
          publicURL
        }
        series
      }
    }
  }
`
