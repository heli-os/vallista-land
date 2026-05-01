import { useState } from 'react'

import { useTextSize } from '../../hooks/useTextSize'
import { HeaderDialogType, HeaderProps, ReturnUseHeader, HeaderDialogVariableType } from './Header.type'

export const useHeader = <T extends HeaderProps>(props: T): ReturnUseHeader & T => {
  const [dialog, setDialog] = useState<HeaderDialogType>({
    visible: false,
    type: 'SETTING'
  })
  const { textSize, changeTextSize } = useTextSize()

  return {
    ...props,
    textSize,
    dialog,
    openDialog,
    closeDialog,
    changeTextSize
  }

  function openDialog(name: HeaderDialogVariableType): void {
    setDialog({ visible: true, type: name })
  }

  function closeDialog(): void {
    setDialog((before) => ({ ...before, visible: false }))
  }
}
