import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Container, Dropdown } from '@heli-os/vallista-core'
import { HeadProps, Link } from 'gatsby'
import { FC, FormEvent, useState } from 'react'

import { Seo } from '../components/Seo'

const SITE_URL = 'https://dataportal.kr'

// Web3Forms access key. 설계상 클라이언트에 노출되는 공개 키이며 비밀값이 아니다.
const WEB3FORMS_ACCESS_KEY = 'c56a3af0-f690-4822-8222-6651232862c9'

const ESSAY_URL = '/ai-시대엔-더-이상-효율은-없다/'
const LINKEDIN_URL = 'https://www.linkedin.com/in/taeyang-jin'
const BOLTA_URL = 'https://bolta.io'
const H6S_URL = 'https://h6s.ai/'
const RETRO_POST_URL = '/2023년-회고-프로젝트-퇴사-창업-채용-기술/'

const RELATED_POSTS = [
  { title: '내가 개발 커뮤니티를 하는 이유', url: '/내가-개발-커뮤니티를-하는-이유/' },
  { title: 'PM은 무얼 하는 사람?', url: '/PM은-무얼-하는-사람/' },
  {
    title: '우리가 하는 일은 두 가지 유형의 일 뿐이다',
    url: '/우리가-하는-일은-두-가지-유형의-일-뿐이다-부제-직무의-통합/'
  }
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

const CoffeeChatPage: FC = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isFormReady = WEB3FORMS_ACCESS_KEY.length > 0

  function scrollToForm(): void {
    if (typeof document === 'undefined') return
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!isFormReady || status === 'submitting') return

    const form = event.currentTarget
    const data = new FormData(form)

    // 허니팟: 봇이 채우는 숨김 필드. 값이 있으면 조용히 성공 처리하고 전송하지 않는다.
    if ((data.get('botcheck') as string)?.length) {
      setStatus('success')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: '커피챗 신청',
      from_name: '테오 블로그 커피챗',
      이름: data.get('name'),
      이메일: data.get('email'),
      휴대전화번호: data.get('phone') || '(미입력)',
      '소속·직군': data.get('affiliation') || '(미입력)',
      '같이 풀고 싶은 것': data.get('topic'),
      '선호 방식·시간대': data.get('preference'),
      추천인: data.get('referral') || '(없음)'
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (response.ok && result.success) {
        form.reset()
        setStatus('success')
      } else {
        setErrorMessage(result.message ?? '전송에 실패했어요. 잠시 후 다시 시도해 주세요.')
        setStatus('error')
      }
    } catch {
      setErrorMessage('네트워크 오류로 전송하지 못했어요. 잠시 후 다시 시도해 주세요.')
      setStatus('error')
    }
  }

  return (
    <Container>
      <Wrapper>
        <PageTitle>AI 시대엔 더 이상 효율은 없다</PageTitle>
        <Hero>
          <p>
            효율과 자동화는 사람의 일을 덜어 줄 뿐, 새로운 값어치는 거기서 나오지 않습니다. 그렇다면 무엇이 남을까요. 그
            질문을 일대일로 같이 풀어 보는 자리입니다.
          </p>
          <CtaButton type='button' onClick={scrollToForm}>
            커피챗 신청하기
          </CtaButton>
        </Hero>

        <Section>
          <h2>이 대화에서 같이 풀고 싶은 질문</h2>
          <p>
            정답을 드리는 자리는 아닙니다. 저도 아직 답을 못 낸 질문이 있어서, 같은 고민을 하는 분과 마주 앉아 생각을
            나눠 보고 싶습니다. 효율이 모두의 것이 된 시대에 사람의 일은 어디로 옮겨 가는지, 문제를 다시 세우는 감각과
            비대칭을 읽는 판단은 어떻게 길러지는지 — 비슷한 질문을 안고 계시다면 함께 이야기해 보고 싶습니다.
          </p>
          <p>이 주제를 더 깊게 풀어 둔 글이 있습니다. 대화 전에 읽어 오시면 이야기가 빨리 깊어집니다.</p>
          <LinkList>
            <li>
              <Link to={ESSAY_URL}>AI 시대엔 더 이상 효율은 없다 (에세이)</Link>
            </li>
          </LinkList>
        </Section>

        <Section>
          <h2>이런 이야기를 나눌 수 있어요</h2>
          <ul>
            <li>취미에서 시작해 중소기업·스타트업·대기업을 거쳐 창업까지 오며 겪은 커리어의 갈림길</li>
            <li>제품 기획과 개발 사이에서 부딪힌 의사결정 고민</li>
            <li>AI를 제품·개발 흐름에 얹어 보며 깨졌던 가정들</li>
            <li>오래 굴려 온 회고·피드백 루틴과 거기서 배운 것</li>
            <li>일과 선택을 정리할 때 제가 쓰는 격자틀 멘탈 모델</li>
          </ul>
        </Section>

        <Section>
          <h2>이런 분과 이야기하고 싶어요</h2>
          <ul>
            <li>커리어의 방향을 다시 세우는 중인 분</li>
            <li>제품·개발·AI가 맞물리는 지점에서 풀리지 않는 질문을 안고 있는 분</li>
            <li>혼자 결론까지 갔지만 다른 판단에 부딪혀 보고 싶은 분</li>
          </ul>
          <p>기술 직군이 아니어도 좋습니다. PM·PO·마케터·디자이너·재무 등 제품을 둘러싼 모든 자리의 분을 환영합니다.</p>
        </Section>

        <Section>
          <h2>저를 간단히 소개하면</h2>
          <p>
            개발을 배운 지 1년쯤 됐을 때, 비싼 솔루션밖에 없던 자영업자들이 눈에 들어왔습니다. C#으로 매장 관리·노래방
            기기 관리 프로그램을 만들어 발품을 팔았고, 제조사가 공개하지 않는 프로토콜은 리모컨 버튼을 하나하나 눌러
            가며 직접 뜯어 맞췄습니다. 그렇게 약 천만 원을 벌면서 처음 배운 건 기술이 아니라, 남들이 비싸다고 지나친
            틈이 곧 기회라는 감각이었습니다.
          </p>
          <p>
            그 감각으로 회사 일과는 별개로 크고 작은 프로젝트를 약 100개 만들었습니다. 마케팅 자동화부터 코로나19 공적
            마스크 공공데이터까지 주제는 매번 달랐지만 방식은 늘 같았습니다. 문제를 다시 정의하고, 익숙한 길 대신 낯선
            길로 부딪혀 보고, 끝나면 되짚어 다음 판단을 바꿉니다. 이 <Link to={RETRO_POST_URL}>회고 루틴</Link>을
            10년째 바꾸지 않고 돌리고 있습니다. 피드백보다 회고가 중요하다고 생각합니다. 되짚은 것을 다음에 반영하지
            않으면 그 시간은 그냥 버린 시간이니까요.
          </p>
          <p>
            볼타를 시작하기 전에도 그 루틴은 회사 밖으로 번졌습니다. C++ 게임 개발을 공부하던 게 유료 기술 콘텐츠가
            됐고, 그다음엔 사람으로 번졌습니다. 동료들과 기술 비영리 단체를 700명 이상 규모로 키웠고, 멘토링으로
            2,000명 이상과 커리어·엔지니어링 이야기를 나눴습니다.
          </p>
          <p>
            그리고 같은 눈으로 더 큰 틈을 보고, 동료들과{' '}
            <a href={BOLTA_URL} target='_blank' rel='noopener noreferrer'>
              볼타
            </a>
            를 시작했습니다. 기업 금융이라는 오래된 비효율을 전자세금계산서부터 손대고 있습니다. 한 방식에 머무르지
            않으려고 계속 다른 길도 시도하는데, 최근엔 헤드리스 방식으로 금융 데이터를 다뤄 본{' '}
            <a href={H6S_URL} target='_blank' rel='noopener noreferrer'>
              headless — Financial Data API
            </a>
            가 그중 하나였습니다.
          </p>
          <p>매번 다른 일처럼 보여도, 돌아보면 늘 틈을 찾고 만들고 되짚는 일이었습니다.</p>
          <LinkList>
            <li>
              <Link to='/resume/'>전체 이력과 활동 보기</Link>
            </li>
          </LinkList>
        </Section>

        <Section id='apply'>
          <h2>커피챗 신청</h2>
          <p>
            평일은 온라인 또는 강남·사당, 주말은 온라인 또는 사당에서 만납니다. 오프라인 커피는 제가 대접합니다. 아래
            폼을 남겨 주시면 메일로 연락드릴게요.
          </p>

          <FormCard>
            {status === 'success' ? (
              <Notice role='status' data-tone='success'>
                신청이 접수됐어요. 메일로 곧 연락드리겠습니다. 고맙습니다.
              </Notice>
            ) : (
              <Form onSubmit={handleSubmit} noValidate>
                {!isFormReady && (
                  <Notice role='status' data-tone='info'>
                    신청 폼을 준비 중입니다. 곧 열립니다.
                  </Notice>
                )}

                <Field>
                  <label htmlFor='cc-name'>이름 *</label>
                  <input id='cc-name' name='name' type='text' required autoComplete='name' />
                </Field>

                <Field>
                  <label htmlFor='cc-email'>이메일 *</label>
                  <input id='cc-email' name='email' type='email' required autoComplete='email' />
                </Field>

                <Field>
                  <label htmlFor='cc-phone'>휴대전화번호</label>
                  <input
                    id='cc-phone'
                    name='phone'
                    type='tel'
                    inputMode='tel'
                    autoComplete='tel'
                    placeholder='010-0000-0000'
                  />
                </Field>

                <Field>
                  <label htmlFor='cc-affiliation'>소속 · 직군</label>
                  <input
                    id='cc-affiliation'
                    name='affiliation'
                    type='text'
                    placeholder='예: 스타트업 PM, 프리랜서 개발자'
                  />
                </Field>

                <Field>
                  <label htmlFor='cc-topic'>이 대화에서 같이 풀고 싶은 것 *</label>
                  <textarea id='cc-topic' name='topic' rows={5} required />
                </Field>

                <Field>
                  <label htmlFor='cc-preference'>선호 방식 · 시간대</label>
                  <Dropdown
                    id='cc-preference'
                    name='preference'
                    aria-label='선호 방식 · 시간대'
                    defaultValue='온라인 / 평일'
                    options={[
                      { label: '온라인 / 평일', value: '온라인 / 평일' },
                      { label: '온라인 / 주말', value: '온라인 / 주말' },
                      { label: '오프라인(강남·사당) / 평일', value: '오프라인(강남·사당) / 평일' },
                      { label: '오프라인(사당) / 주말', value: '오프라인(사당) / 주말' }
                    ]}
                  />
                </Field>

                <Field>
                  <label htmlFor='cc-referral'>추천인 (있다면)</label>
                  <input id='cc-referral' name='referral' type='text' placeholder='소개해 주신 분의 이름' />
                </Field>

                <Honeypot>
                  <label htmlFor='cc-botcheck'>이 칸은 비워 두세요</label>
                  <input id='cc-botcheck' name='botcheck' type='text' tabIndex={-1} autoComplete='off' />
                </Honeypot>

                {status === 'error' && (
                  <Notice role='alert' data-tone='error'>
                    {errorMessage}
                  </Notice>
                )}

                <SubmitButton type='submit' disabled={!isFormReady || status === 'submitting'}>
                  {status === 'submitting' ? '보내는 중…' : '신청 보내기'}
                </SubmitButton>
              </Form>
            )}
          </FormCard>
        </Section>

        <Section>
          <h2>더 읽어볼 거리</h2>
          <LinkList>
            <li>
              <Link to={ESSAY_URL}>AI 시대엔 더 이상 효율은 없다</Link> — 이 대화의 출발점이 된 글
            </li>
            {RELATED_POSTS.map((post) => (
              <li key={post.url}>
                <Link to={post.url}>{post.title}</Link>
              </li>
            ))}
            <li>
              LinkedIn:{' '}
              <a href={LINKEDIN_URL} target='_blank' rel='noopener noreferrer'>
                진태양(Theo)
              </a>
            </li>
            <li>
              볼타:{' '}
              <a href={BOLTA_URL} target='_blank' rel='noopener noreferrer'>
                bolta.io
              </a>
            </li>
            <li>
              Financial Data API:{' '}
              <a href={H6S_URL} target='_blank' rel='noopener noreferrer'>
                h6s.ai
              </a>
            </li>
          </LinkList>
        </Section>
      </Wrapper>
    </Container>
  )
}

export default CoffeeChatPage

export const Head = ({ location }: HeadProps) => {
  const breadcrumbs = [
    { name: '홈', url: `${SITE_URL}/` },
    { name: '커피챗', url: `${SITE_URL}/coffee-chat/` }
  ]

  const profilePageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: '커피챗 · 테오 블로그',
    url: `${SITE_URL}/coffee-chat/`,
    mainEntity: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` }
  }

  return (
    <>
      <Seo
        name='커피챗'
        description='AI 시대엔 더 이상 효율은 없다. 제품·개발·AI를 둘러싼 열린 질문을 일대일로 함께 푸는 커피챗을 신청하세요.'
        image='/og/coffee-chat.jpeg'
        breadcrumbs={breadcrumbs}
        pathname={location.pathname}
      />
      <script type='application/ld+json'>{JSON.stringify(profilePageJsonLd)}</script>
    </>
  )
}

const Wrapper = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: 760px;
  padding: 2rem;
`

const PageTitle = styled.h1`
  ${({ theme }) => css`
    font-size: 2rem;
    font-weight: 800;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    margin-bottom: 1rem;
  `}
`

const Hero = styled.div`
  ${({ theme }) => css`
    margin-bottom: 3rem;

    & > p {
      font-size: 1.05rem;
      line-height: 1.85;
      color: ${theme.colors.PRIMARY.ACCENT_6};
      margin: 0 0 1.5rem;
    }
  `}
`

const CtaButton = styled.button`
  ${({ theme }) => css`
    display: inline-block;
    border: none;
    border-radius: 8px;
    padding: 0.85rem 1.6rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    color: #fff;
    background: ${theme.colors.HIGHLIGHT.ORANGE};

    &:hover {
      opacity: 0.9;
    }
  `}
`

const Section = styled.section`
  ${({ theme }) => css`
    margin-bottom: 2.5rem;
    scroll-margin-top: 2rem;

    & > h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: ${theme.colors.PRIMARY.FOREGROUND};
      margin: 0 0 0.8rem;
    }

    & > p {
      font-size: 1rem;
      line-height: 1.8;
      color: ${theme.colors.PRIMARY.ACCENT_6};
      margin: 0 0 0.8rem;
    }

    & > ul {
      list-style: disc;
      padding-left: 1.3rem;
      font-size: 1rem;
      line-height: 1.9;
      color: ${theme.colors.PRIMARY.ACCENT_6};
    }

    & > ul li {
      margin-bottom: 0.3rem;
    }
  `}
`

const LinkList = styled.ul`
  ${({ theme }) => css`
    list-style: disc;
    padding-left: 1.3rem;
    font-size: 1rem;
    line-height: 1.9;
    color: ${theme.colors.PRIMARY.ACCENT_6};
  `}
`

const FormCard = styled.div`
  ${({ theme }) => css`
    margin-top: 1.2rem;
    padding: 1.75rem;
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    border-radius: 10px;
    background: ${theme.colors.PRIMARY.BACKGROUND};
    box-shadow: ${theme.shadows.SMALL};

    @media screen and (max-width: 1024px) {
      padding: 1.25rem;
    }
  `}
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`

const Field = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    & > label {
      font-size: 0.95rem;
      font-weight: 600;
      color: ${theme.colors.PRIMARY.FOREGROUND};
    }

    & > input,
    & > textarea {
      font: inherit;
      padding: 0.7rem 0.8rem;
      border-radius: 6px;
      border: 1px solid ${theme.colors.PRIMARY.ACCENT_3};
      background: ${theme.colors.PRIMARY.BACKGROUND};
      color: ${theme.colors.PRIMARY.FOREGROUND};
    }

    & > textarea {
      resize: vertical;
      line-height: 1.7;
    }

    & > input:focus,
    & > textarea:focus {
      outline: 2px solid ${theme.colors.HIGHLIGHT.ORANGE};
      outline-offset: 1px;
    }
  `}
`

const Honeypot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`

const SubmitButton = styled.button`
  ${({ theme }) => css`
    align-self: flex-end;
    border: none;
    border-radius: 8px;
    padding: 0.85rem 1.8rem;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    background: ${theme.colors.HIGHLIGHT.ORANGE};
    cursor: pointer;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`

const Notice = styled.div`
  ${({ theme }) => css`
    padding: 0.9rem 1rem;
    border-radius: 6px;
    font-size: 0.95rem;
    line-height: 1.7;

    &[data-tone='success'] {
      color: ${theme.colors.SUCCESS.DEFAULT};
      border: 1px solid ${theme.colors.SUCCESS.DEFAULT};
    }

    &[data-tone='error'] {
      color: ${theme.colors.ERROR.DEFAULT};
      border: 1px solid ${theme.colors.ERROR.DEFAULT};
    }

    &[data-tone='info'] {
      color: ${theme.colors.PRIMARY.ACCENT_6};
      border: 1px solid ${theme.colors.PRIMARY.ACCENT_3};
    }
  `}
`
