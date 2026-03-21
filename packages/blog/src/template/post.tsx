import { graphql } from 'gatsby'
import { useCallback, VFC } from 'react'
import { PageProps, PostQuery } from 'types/type'

import { AdSense } from '../components/AdSense'
import { Comment } from '../components/Comment'
import { Markdown } from '../components/Markdown'
import { PostHeader } from '../components/PostHeader'
import { Seo } from '../components/Seo'
import { Series } from '../components/Series'
import { useConfig } from '../hooks/useConfig'

const Post: VFC<PageProps<PostQuery>> = (props) => {
  const { profile } = useConfig()
  const { allMarkdownRemark } = props.data
  const { nodes, group: seriesGroup } = allMarkdownRemark
  const { timeToRead, html, excerpt } = props.data.markdownRemark
  const { title, date, image, tags, series, description: frontmatterDescription } = props.data.markdownRemark.frontmatter
  const lastModified = props.data.markdownRemark.fields?.lastModified
  const siteUrl = 'https://dataportal.kr'

  const breadcrumbs = [
    { name: '홈', url: `${siteUrl}/` },
    { name: '글 목록', url: `${siteUrl}/posts/` },
    { name: title, url: `${siteUrl}${props.data.markdownRemark.fields.slug}` }
  ]

  const cachedFilterSeries = useCallback(getFilteredSeries, [props.data])

  return (
    <div>
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
      />
      <PostHeader
        title={title}
        date={date}
        image={image?.publicURL}
        tags={tags}
        timeToRead={timeToRead}
        author={profile.author}
      >
        {series && seriesGroup && <Series name={series} posts={cachedFilterSeries()} />}
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
  }
}

export default Post

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!) {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
      group(field: frontmatter___series) {
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
