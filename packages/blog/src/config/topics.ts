import topicsData from '../../config/topics.json'

export interface TopicSection {
  title: string
  description: string
  slugs: string[]
}

export interface Topic {
  id: string
  path: string
  title: string
  seoTitle: string
  description: string
  updated: string
  intro: string[]
  readingOrder: string[]
  sections: TopicSection[]
}

export const topics = topicsData as Topic[]

export const getTopicById = (id: string): Topic | undefined => topics.find((topic) => topic.id === id)

export const getTopicForSlug = (slug: string): { topic: Topic; section: TopicSection } | undefined => {
  const normalizedSlug = decodeURIComponent(slug).replace(/^\/+|\/+$/g, '')

  for (const topic of topics) {
    const section = topic.sections.find((candidate) => candidate.slugs.includes(normalizedSlug))
    if (section) return { topic, section }
  }

  return undefined
}
