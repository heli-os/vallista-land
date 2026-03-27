import { ReturningTabsProps } from './type'

export function useTabs<T>(props: T): T & ReturningTabsProps {
  return {
    ...props
  } as T & ReturningTabsProps
}
