import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FC } from 'react'

import { useTextSize } from '../../hooks/useTextSize'

const fontSizeControllerMapper = [14, 16, 18, 20]

export const TextSizeControl: FC = () => {
  const { textSize, changeTextSize } = useTextSize()

  return (
    <Wrapper>
      <Label>
        <SmallA>A</SmallA>
        <LargeA>A</LargeA>
      </Label>
      <GaugeWrapper>
        {fontSizeControllerMapper.map((size, idx, arr) => (
          <GaugeDot
            key={size}
            idx={idx}
            max={arr.length}
            selected={textSize === size}
            onClick={() => changeTextSize(size)}
          />
        ))}
      </GaugeWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Label = styled.span`
  ${({ theme }) => css`
    display: flex;
    align-items: baseline;
    gap: 1px;
    color: ${theme.colors.PRIMARY.ACCENT_4};
    user-select: none;
  `}
`

const SmallA = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
`

const LargeA = styled.span`
  font-size: 1rem;
  font-weight: 600;
`

const GaugeWrapper = styled.div`
  ${({ theme }) => css`
    position: relative;
    display: flex;
    align-items: center;
    width: 80px;
    height: 8px;
    border-radius: 4px;
    background-color: ${theme.colors.PRIMARY.ACCENT_2};
  `}
`

const GaugeDot = styled.div<{ idx: number; max: number; selected: boolean }>`
  ${({ theme, idx, max, selected }) => css`
    position: absolute;
    width: ${selected ? '12px' : '10px'};
    height: ${selected ? '12px' : '10px'};
    border-radius: 50%;
    cursor: pointer;
    left: ${(idx / (max - 1)) * 100}%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: ${selected ? theme.colors.HIGHLIGHT.ORANGE : theme.colors.PRIMARY.ACCENT_4};
    transition: all 0.15s ease;

    &:first-of-type {
      left: 6%;
    }

    &:last-of-type {
      left: 94%;
    }

    &:hover {
      background-color: ${theme.colors.HIGHLIGHT.ORANGE};
    }
  `}
`
