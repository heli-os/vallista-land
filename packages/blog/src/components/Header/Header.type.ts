export interface HeaderProps {
  fold: boolean
  folding: () => void
}

export interface ReturnUseHeader {
  dialog: HeaderDialogType
  textSize: number
  openDialog: (name: HeaderDialogVariableType) => void
  closeDialog: () => void
  changeTextSize: (size: number) => void
}

export type HeaderDialogVariableType = 'SETTING'
export interface HeaderDialogType {
  visible: boolean
  type: HeaderDialogVariableType
}
