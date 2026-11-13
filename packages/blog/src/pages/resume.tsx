import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Container } from '@heli-os/vallista-core'
import { HeadProps, Link } from 'gatsby'
import { FC, ReactNode, useEffect, useRef } from 'react'

import { Seo } from '../components/Seo'
import { ResumeCareer, ResumeEntrySection, ResumeProject, useConfig } from '../hooks/useConfig'

const ResumePage: FC = () => {
  const { resume } = useConfig()
  const { profile, careers } = resume
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closedDetails = new Set<HTMLDetailsElement>()

    const expandProjects = () => {
      resumeRef.current?.querySelectorAll('details').forEach((details) => {
        if (!details.open) {
          closedDetails.add(details)
          // 인쇄 스냅샷에 즉시 반영하도록 DOM의 open 속성을 직접 변경한다.
          details.open = true
        }
      })
    }

    const restoreProjects = () => {
      closedDetails.forEach((details) => {
        details.open = false
      })
      closedDetails.clear()
    }

    window.addEventListener('beforeprint', expandProjects)
    window.addEventListener('afterprint', restoreProjects)

    return () => {
      window.removeEventListener('beforeprint', expandProjects)
      window.removeEventListener('afterprint', restoreProjects)
      restoreProjects()
    }
  }, [])

  return (
    <Container>
      <Wrapper ref={resumeRef}>
        <Hero>
          <Name>
            {profile.name} <NameEn>{profile.nameEn}</NameEn>
          </Name>
          <Role>{profile.role}</Role>
          {profile.intro.map((paragraph) => (
            <Intro key={paragraph}>{paragraph}</Intro>
          ))}
          <HeroLinks>
            {profile.links.map((link) => (
              <li key={link.url}>
                <SmartLink href={link.url}>{link.label}</SmartLink>
              </li>
            ))}
          </HeroLinks>
        </Hero>

        <Section aria-labelledby='careers'>
          <h2 id='careers'>{careers.title}</h2>
          <Timeline>
            {careers.list.map((career) => (
              <CareerItem key={career.name} career={career} />
            ))}
          </Timeline>
        </Section>

        <EntrySection id='awards' section={resume.awards} />
        <EntrySection id='talks' section={resume.talks} />
        <EntrySection id='community' section={resume.community} />
        <EntrySection id='opensources' section={resume.opensources} />
        <EntrySection id='writing' section={resume.writing} />
      </Wrapper>
    </Container>
  )
}

export default ResumePage

export const Head = ({ location }: HeadProps) => {
  const breadcrumbs = [
    { name: '홈', url: '/' },
    { name: '이력서', url: '/resume/' }
  ]

  return (
    <Seo
      name='이력서'
      description='볼타 공동창업자이자 CTO인 진태양(Theo)의 경력과 활동. 전자세금계산서와 금융 API, 카카오페이 금융 플랫폼, 코드포코리아 공적 마스크 API와 개인안심번호.'
      image='/og/resume.jpeg'
      pageType='profile'
      breadcrumbs={breadcrumbs}
      pathname={location.pathname}
    />
  )
}

/** 주소가 없으면 텍스트만, 내부 경로는 Gatsby Link, 외부 주소는 새 창으로 연다 */
const SmartLink: FC<{ href?: string; children: ReactNode }> = ({ href, children }) => {
  if (!href) return <>{children}</>
  if (href.startsWith('/')) return <Link to={href}>{children}</Link>
  return (
    <a href={href} target='_blank' rel='noopener noreferrer'>
      {children}
    </a>
  )
}

const formatPeriod = (startDate?: string, endDate?: string | null): string | null => {
  if (!startDate) return null
  if (endDate === startDate) return startDate
  return `${startDate} ~ ${endDate ?? '현재'}`
}

const CareerItem: FC<{ career: ResumeCareer }> = ({ career }) => {
  const isCurrent = career.endDate === null

  return (
    <TimelineItem data-current={isCurrent}>
      <ItemHeader>
        <h3>
          <SmartLink href={career.url}>{career.name}</SmartLink>
        </h3>
        <Period>{formatPeriod(career.startDate, career.endDate)}</Period>
      </ItemHeader>
      <Position>{career.position}</Position>
      <Summary>{career.summary}</Summary>
      {career.techStacks && career.techStacks.length > 0 && (
        <Stacks aria-label='주요 기술'>
          {career.techStacks.map((stack) => (
            <li key={stack}>{stack}</li>
          ))}
        </Stacks>
      )}
      {career.fold ? (
        <Fold>
          <summary>주요 프로젝트 {career.projects.length}개</summary>
          <ProjectList projects={career.projects} />
        </Fold>
      ) : (
        <ProjectList projects={career.projects} />
      )}
    </TimelineItem>
  )
}

const ProjectList: FC<{ projects: ResumeProject[] }> = ({ projects }) => (
  <Projects>
    {projects.map((project) => {
      const period = formatPeriod(project.startDate, project.endDate)

      return (
        <Project key={project.name}>
          <ItemHeader>
            <h4>{project.name}</h4>
            {period && <Period>{period}</Period>}
          </ItemHeader>
          {project.summary && <ProjectSummary>{project.summary}</ProjectSummary>}
          <Highlights>
            {project.highlights.map((highlight) => (
              <li key={highlight.title}>
                <SmartLink href={highlight.url}>{highlight.title}</SmartLink>
                {highlight.items && highlight.items.length > 0 && (
                  <ul>
                    {highlight.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </Highlights>
        </Project>
      )
    })}
  </Projects>
)

const EntrySection: FC<{ id: string; section: ResumeEntrySection }> = ({ id, section }) => (
  <Section aria-labelledby={id}>
    <h2 id={id}>{section.title}</h2>
    <Entries>
      {section.list.map((entry) => (
        <li key={`${entry.title}-${entry.date ?? ''}`}>
          <ItemHeader>
            <EntryTitle>
              <SmartLink href={entry.url}>{entry.title}</SmartLink>
            </EntryTitle>
            {entry.date && <Period>{entry.date}</Period>}
          </ItemHeader>
          {entry.org && <EntryOrg>{entry.org}</EntryOrg>}
          {entry.description && <EntryDescription>{entry.description}</EntryDescription>}
          {entry.links && entry.links.length > 0 && (
            <EntryLinks>
              {entry.links.map((link) => (
                <li key={link.url}>
                  <SmartLink href={link.url}>{link.label}</SmartLink>
                </li>
              ))}
            </EntryLinks>
          )}
        </li>
      ))}
    </Entries>
  </Section>
)

const Wrapper = styled.div`
  ${({ theme }) => css`
    margin: 0 auto;
    width: 100%;
    max-width: 760px;
    padding: 2rem;
    box-sizing: border-box;
    color: ${theme.colors.PRIMARY.ACCENT_6};
    word-break: keep-all;
    overflow-wrap: anywhere;

    a {
      color: ${theme.colors.PRIMARY.FOREGROUND};
      text-decoration: underline;
      text-decoration-color: ${theme.colors.PRIMARY.ACCENT_3};
      text-underline-offset: 3px;
      transition: text-decoration-color 0.15s ease;
    }

    a:hover,
    a:focus-visible {
      text-decoration-color: ${theme.colors.HIGHLIGHT.ORANGE};
    }

    @media screen and (max-width: 600px) {
      padding: 1.5rem 1.25rem;
    }
  `}
`

const Hero = styled.header`
  margin-bottom: 3rem;
`

const Name = styled.h1`
  ${({ theme }) => css`
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.2;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    margin: 0 0 0.4rem;
  `}
`

const NameEn = styled.span`
  ${({ theme }) => css`
    font-size: 1.25rem;
    font-weight: 500;
    color: ${theme.colors.PRIMARY.ACCENT_4};
  `}
`

const Role = styled.p`
  ${({ theme }) => css`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${theme.colors.PRIMARY.ACCENT_7};
    margin: 0 0 1.5rem;
  `}
`

const Intro = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0 0 0.8rem;
`

const HeroLinks = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  font-weight: 600;
`

const Section = styled.section`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    padding-top: 2rem;
    margin-bottom: 3rem;

    & > h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: ${theme.colors.PRIMARY.FOREGROUND};
      margin: 0 0 1.5rem;
    }
  `}
`

const Timeline = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`

const TimelineItem = styled.li`
  ${({ theme }) => css`
    position: relative;
    padding: 0 0 2.5rem 1.5rem;
    border-left: 1px solid ${theme.colors.PRIMARY.ACCENT_2};

    &:last-of-type {
      padding-bottom: 0;
    }

    &::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 0.55rem;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      box-sizing: border-box;
      background: ${theme.colors.PRIMARY.BACKGROUND};
      border: 2px solid ${theme.colors.PRIMARY.ACCENT_3};
    }

    &[data-current='true']::before {
      background: ${theme.colors.HIGHLIGHT.ORANGE};
      border-color: ${theme.colors.HIGHLIGHT.ORANGE};
    }

    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: ${theme.colors.PRIMARY.FOREGROUND};
      margin: 0;
    }
  `}
`

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.25rem 1rem;

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`

const Period = styled.span`
  ${({ theme }) => css`
    flex-shrink: 0;
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;
    color: ${theme.colors.PRIMARY.ACCENT_4};
  `}
`

const Position = styled.p`
  ${({ theme }) => css`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${theme.colors.PRIMARY.ACCENT_5};
    margin: 0.25rem 0 0.6rem;
  `}
`

const Summary = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  margin: 0 0 0.8rem;
`

const Stacks = styled.ul`
  ${({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;

    li {
      font-size: 0.8rem;
      line-height: 1;
      padding: 0.3rem 0.5rem;
      border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
      border-radius: 4px;
      color: ${theme.colors.PRIMARY.ACCENT_5};
    }
  `}
`

const Fold = styled.details`
  ${({ theme }) => css`
    & > summary {
      display: inline-block;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      color: ${theme.colors.PRIMARY.ACCENT_5};
      list-style: none;
    }

    & > summary::-webkit-details-marker {
      display: none;
    }

    & > summary::before {
      content: '+';
      display: inline-block;
      width: 1rem;
      color: ${theme.colors.HIGHLIGHT.ORANGE};
    }

    &[open] > summary::before {
      content: '−';
    }

    & > summary:hover,
    & > summary:focus-visible {
      color: ${theme.colors.PRIMARY.FOREGROUND};
    }

    @media print {
      & > summary {
        display: none;
      }
    }
  `}
`

const Projects = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`

const Project = styled.div`
  ${({ theme }) => css`
    h4 {
      font-size: 1rem;
      font-weight: 700;
      color: ${theme.colors.PRIMARY.ACCENT_7};
      margin: 0;
    }
  `}
`

const ProjectSummary = styled.p`
  ${({ theme }) => css`
    font-size: 0.95rem;
    color: ${theme.colors.PRIMARY.ACCENT_5};
    margin: 0.25rem 0 0;
  `}
`

const Highlights = styled.ul`
  ${({ theme }) => css`
    list-style: disc;
    padding-left: 1.2rem;
    margin: 0.5rem 0 0;
    font-size: 0.95rem;
    line-height: 1.7;

    li {
      margin-bottom: 0.25rem;
    }

    li::marker {
      color: ${theme.colors.HIGHLIGHT.ORANGE};
    }

    ul {
      list-style: circle;
      padding-left: 1.2rem;
      margin: 0.2rem 0 0;
      color: ${theme.colors.PRIMARY.ACCENT_5};
    }

    ul li::marker {
      color: ${theme.colors.PRIMARY.ACCENT_3};
    }
  `}
`

const Entries = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`

const EntryTitle = styled.span`
  ${({ theme }) => css`
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.6;
    color: ${theme.colors.PRIMARY.FOREGROUND};
  `}
`

const EntryOrg = styled.p`
  ${({ theme }) => css`
    font-size: 0.9rem;
    color: ${theme.colors.PRIMARY.ACCENT_5};
    margin: 0.1rem 0 0;
  `}
`

const EntryDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0.2rem 0 0;
`

const EntryLinks = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  list-style: none;
  padding: 0;
  margin: 0.3rem 0 0;
  font-size: 0.9rem;
`
