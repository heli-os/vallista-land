import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'

import { DropdownProps } from './type'
import { useDropdown } from './useDropdown'

/**
 * # Dropdown
 *
 * 네이티브 `<select>` 대신 사용하는 커스텀 드롭다운 컴포넌트.
 * listbox 패턴(키보드 탐색 · ARIA · 외부 클릭 닫힘)을 따르며,
 * `name` 을 지정하면 폼 호환용 hidden input 을 함께 렌더해
 * `FormData` 로 값을 그대로 읽을 수 있다.
 *
 * @param {DropdownProps} {@link DropdownProps} 기본 프랍
 *
 * @example ```tsx
 * const [value, setValue] = useState('a')
 * <Dropdown
 *   value={value}
 *   onChange={setValue}
 *   options={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]}
 * />
 * ```
 */
export const Dropdown: FC<DropdownProps> = (props) => {
  const { options, disabled, placeholder, name, id, className, selected, setSelected, uniqueId } =
    useDropdown(props)
  const ariaLabel = props['aria-label']

  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const listId = `${uniqueId}-list`
  const optionId = (index: number): string => `${uniqueId}-option-${index}`
  const selectedIndex = options.findIndex((option) => option.value === selected)
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : undefined

  useEffect(() => {
    if (!isOpen) return

    const handleOutside = (e: MouseEvent): void => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  return (
    <Wrapper ref={wrapperRef} className={className}>
      <Trigger
        ref={triggerRef}
        type='button'
        id={id}
        role='combobox'
        disabled={disabled}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        isPlaceholder={selectedLabel === undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedLabel ?? placeholder ?? ''}</span>
        <Chevron
          isOpen={isOpen}
          viewBox='0 0 24 24'
          width='18'
          height='18'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          shapeRendering='geometricPrecision'
        >
          <path d='M6 9l6 6 6-6' />
        </Chevron>
      </Trigger>
      {isOpen && (
        <List id={listId} role='listbox' aria-label={ariaLabel}>
          {options.map((option, index) => (
            <Option
              key={option.value}
              id={optionId(index)}
              role='option'
              aria-selected={option.value === selected}
              isActive={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(index)}
            >
              {option.label}
            </Option>
          ))}
        </List>
      )}
      {name && <input type='hidden' name={name} value={selected ?? ''} readOnly />}
    </Wrapper>
  )

  function handleToggle(): void {
    if (disabled) return
    setIsOpen((prev) => {
      const next = !prev
      if (next) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
      return next
    })
  }

  function handleSelect(index: number): void {
    const option = options[index]
    if (!option) return
    setSelected(option.value)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  function open(): void {
    setIsOpen(true)
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>): void {
    if (disabled) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) open()
        else setActiveIndex((i) => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) open()
        else setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        if (isOpen) {
          e.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (isOpen) {
          e.preventDefault()
          setActiveIndex(options.length - 1)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen) handleSelect(activeIndex)
        else open()
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          setIsOpen(false)
        }
        break
      case 'Tab':
        if (isOpen) setIsOpen(false)
        break
    }
  }
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const Trigger = styled.button<{ isPlaceholder: boolean }>`
  ${({ theme, isPlaceholder }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    font: inherit;
    text-align: left;
    padding: 0.7rem 0.8rem;
    border-radius: 6px;
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_3};
    background: ${theme.colors.PRIMARY.BACKGROUND};
    color: ${isPlaceholder ? theme.colors.PRIMARY.ACCENT_4 : theme.colors.PRIMARY.FOREGROUND};
    cursor: pointer;
    box-sizing: border-box;

    & > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:disabled {
      cursor: not-allowed;
      background: ${theme.colors.PRIMARY.ACCENT_1};
      color: ${theme.colors.PRIMARY.ACCENT_4};
    }

    &:focus-visible {
      outline: 2px solid ${theme.colors.HIGHLIGHT.ORANGE};
      outline-offset: 1px;
    }
  `}
`

const Chevron = styled.svg<{ isOpen: boolean }>`
  flex-shrink: 0;
  transition: transform 0.18s ease;
  transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
`

const List = styled.ul`
  ${({ theme }) => css`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: ${theme.layers.AFTER_STANDARD};
    margin: 0;
    padding: 4px;
    list-style: none;
    max-height: 240px;
    overflow-y: auto;
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_3};
    border-radius: 6px;
    background: ${theme.colors.PRIMARY.BACKGROUND};
    box-shadow: ${theme.shadows.MEDIUM};
    animation: dropdown-in 0.14s ease;

    @keyframes dropdown-in {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}
`

const Option = styled.li<{ isActive: boolean }>`
  ${({ theme, isActive }) => css`
    padding: 0.6rem 0.8rem;
    border-radius: 4px;
    font: inherit;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    cursor: pointer;
    user-select: none;
    background: ${isActive ? theme.colors.PRIMARY.ACCENT_2 : 'transparent'};

    &[aria-selected='true'] {
      font-weight: 600;
    }
  `}
`
