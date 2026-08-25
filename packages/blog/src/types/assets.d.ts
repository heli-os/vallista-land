// 에셋 import용 앰비언트 선언.
//
// 예전에는 이 선언이 type.d.ts에 있었는데, 같은 디렉터리의 type.ts와 이름이 겹쳐
// TypeScript가 type.d.ts를 type.ts의 선언 출력물로 보고 프로그램에서 제외했다.
// 그래서 선언 전체가 동작하지 않았다. 파일명을 분리해 되살린다.

declare module '*.svg' {
  const source: string
  export default source
}

declare module '*.png' {
  const source: string
  export default source
}

declare module '*.jpg' {
  const source: string
  export default source
}

declare module '*.jpeg' {
  const source: string
  export default source
}

declare module '*.gif' {
  const source: string
  export default source
}

declare module '*.yaml' {
  const content: unknown
  export default content
}

declare module '*.css' {
  const classNames: Record<string, string>
  export = classNames
}
