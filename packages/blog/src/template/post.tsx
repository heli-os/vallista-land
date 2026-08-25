import { graphql, HeadProps } from 'gatsby'
import { useCallback, FC } from 'react'
import { PageProps, PostQuery } from 'types/type'

import { AdSense } from '../components/AdSense'
import { Comment } from '../components/Comment'
import { Markdown } from '../components/Markdown'
import { PostHeader } from '../components/PostHeader'
import { RelatedPosts } from '../components/RelatedPosts'
import { Seo } from '../components/Seo'
import { Series } from '../components/Series'
import { useConfig } from '../hooks/useConfig'

const Post: FC<PageProps<PostQuery>> = (props) => {
  const { profile } = useConfig()
  const { allMarkdownRemark } = props.data
  const { nodes, group: seriesGroup } = allMarkdownRemark
  const { timeToRead, html, excerpt } = props.data.markdownRemark
  const { title, date, updated, image, tags, series } = props.data.markdownRemark.frontmatter

  const cachedFilterSeries = useCallback(getFilteredSeries, [props.data])

  return (
    <div>
      <PostHeader
        title={title}
        date={date}
        updated={updated}
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
      <RelatedPosts currentSlug={props.data.markdownRemark.fields.slug} posts={nodes} />
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

export const Head = ({ data, location }: HeadProps<PostQuery>) => {
  const { title, seoTitle, date, image, tags, description: frontmatterDescription } = data.markdownRemark.frontmatter
  const { timeToRead, excerpt } = data.markdownRemark
  const lastModified = data.markdownRemark.fields?.lastModified

  const breadcrumbs = [
    { name: '홈', url: '/' },
    { name: '글 목록', url: '/posts/' },
    { name: title, url: data.markdownRemark.fields.slug }
  ]

  return (
    <Seo
      name={title}
      seoTitle={seoTitle}
      description={frontmatterDescription || excerpt}
      image={image?.publicURL}
      pageType='post'
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
      filter: { fields: { contentType: { eq: "posts" } }, frontmatter: { draft: { ne: true } } }
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
        seoTitle
        description
        tags
        date
        updated
        image {
          publicURL
        }
        series
      }
    }
  }
`
