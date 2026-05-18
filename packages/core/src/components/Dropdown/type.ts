export interface DropdownOption {
  label: string
  value: string
}

export interface DropdownProps {
  /** 선택지 목록 */
  options: DropdownOption[]
  /** 제어 컴포넌트로 사용할 때의 현재 값 */
  value?: string
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: string
  /** 값이 바뀔 때 호출 */
  onChange?: (value: string) => void
  /** 비활성화 */
  disabled?: boolean
  /** 선택된 값이 없을 때 트리거에 표시할 문구 */
  placeholder?: string
  /** 지정 시 폼 호환용 hidden input 을 렌더 (FormData 에 잡힘) */
  name?: string
  /** 트리거 버튼의 id */
  id?: string
  /** 루트 wrapper 에 전달되는 className (소비측 스타일 오버라이드용) */
  className?: string
  /** 접근성 라벨 */
  'aria-label'?: string
}

export type NeedDropdownProps = Required<Pick<DropdownProps, 'disabled' | 'options'>>
