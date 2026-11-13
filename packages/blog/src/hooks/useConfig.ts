import profile from '../../config/profile.json'
import resume from '../../config/resume.json'

export interface ResumeLink {
  label: string
  url: string
}

export interface ResumeHighlight {
  title: string
  url?: string
  items?: string[]
}

export interface ResumeProject {
  name: string
  startDate?: string
  endDate?: string | null
  summary?: string
  highlights: ResumeHighlight[]
}

export interface ResumeCareer {
  name: string
  url?: string
  position: string
  startDate: string
  endDate: string | null
  summary: string
  fold: boolean
  techStacks?: string[]
  projects: ResumeProject[]
}

/** 수상, 발표, 커뮤니티, 오픈소스, 글쓰기 섹션이 함께 쓰는 항목 */
export interface ResumeEntry {
  title: string
  date?: string
  org?: string
  description?: string
  url?: string
  links?: ResumeLink[]
}

export interface ResumeEntrySection {
  title: string
  list: ResumeEntry[]
}

export interface Resume {
  profile: {
    name: string
    nameEn: string
    role: string
    intro: string[]
    links: ResumeLink[]
  }
  careers: {
    title: string
    list: ResumeCareer[]
  }
  awards: ResumeEntrySection
  talks: ResumeEntrySection
  community: ResumeEntrySection
  opensources: ResumeEntrySection
  writing: ResumeEntrySection
}

interface ReturningUseConfig {
  profile: {
    author: string
    title: string
    titleTemplate: string
    placeholder: string
    siteUrl: string
    description: string
    twitterUserName: string
    github: string
    secondary: string
  }
  resume: Resume
}

// JSON을 Resume 타입에 대입해 스키마가 어긋나면 타입 검사에서 걸리게 한다
const resumeData: Resume = resume

export function useConfig(): ReturningUseConfig {
  return {
    profile: profile as ReturningUseConfig['profile'],
    resume: resumeData
  }
}
