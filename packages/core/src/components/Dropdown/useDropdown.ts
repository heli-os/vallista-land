import { useControlledState } from '../../hooks/useControlledState'
import { useUniqueId } from '../../hooks/useUniqueId'
import { DropdownProps, NeedDropdownProps } from './type'

const initProps: NeedDropdownProps = {
  disabled: false,
  options: []
}

export function useDropdown(props: DropdownProps): DropdownProps &
  NeedDropdownProps & {
    uniqueId: string
    selected: string | undefined
    setSelected: (value: string) => void
  } {
  const merged = { ...initProps, ...props }
  const uniqueId = useUniqueId()
  const [selected, setSelected] = useControlledState<string>(props.value, props.defaultValue, props.onChange)

  return {
    ...merged,
    uniqueId,
    selected,
    setSelected
  }
}
