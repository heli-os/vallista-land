import { Footer as FooterWrapper, FooterGroup, FooterLink, Spacer, Text } from '@heli-os/vallista-core'
import { Link } from 'gatsby'
import { VFC } from 'react'

import * as Styled from './Footer.style'

export const Footer: VFC = () => {
  const nowYear = new Date().getFullYear()

  return (
    <div>
      <Styled._FooterBox>
        <FooterWrapper>
          <FooterGroup title='사이트 맵'>
            <FooterLink custom>
              <Link to='/'>홈</Link>
            </FooterLink>
            <FooterLink custom>
              <Link to='/posts'>포스트</Link>
            </FooterLink>
            <FooterLink custom>
              <Link to='/resume'>이력서</Link>
            </FooterLink>
          </FooterGroup>
          <FooterGroup title='볼타'>
            <FooterLink href='https://careers.bolta.io'>채용</FooterLink>
            <FooterLink href='https://bolta.io'>홈페이지</FooterLink>
          </FooterGroup>
          <FooterGroup title='위클리 아카데미'>
            <FooterLink href='https://open.kakao.com/o/gyvuT5Yd'>채팅방(비밀번호: 9323)</FooterLink>
            <FooterLink href='https://weekly.ac'>홈페이지</FooterLink>
          </FooterGroup>
          <FooterGroup title='관련 사이트'>
            <FooterLink href='https://dataportal.kr/rss.xml'>RSS 피드</FooterLink>
            <FooterLink href='https://epic.weekly.ac'>에픽 뉴스레터</FooterLink>
          </FooterGroup>
        </FooterWrapper>
      </Styled._FooterBox>
      <Styled._FooterAllRightReserve>
        <Text size={12}>
          Copyright ⓒ {nowYear} <Link to='https://dataportal.kr'>Theo</Link> All rights reserved.
        </Text>
        <Spacer y={0.1} />
        <Text size={12}>
          Created by <Link to='https://dataportal.kr'>@Theo</Link>. Powered By{' '}
          <a href='https://github.com/Vallista/vallista-land' target='_blank' rel='nofollow'>
            @Vallista-land
          </a>
        </Text>
        <Spacer y={0.5} />
      </Styled._FooterAllRightReserve>
    </div>
  )
}
