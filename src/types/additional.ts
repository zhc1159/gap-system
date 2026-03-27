// ===========================================
// Additional Type Definitions
// ===========================================

declare module 'nprogress' {
  interface NProgressOptions {
    parent?: string
    template?: string
    easing?: string
    positionUsing?: string
    speed?: number
    trickleSpeed?: number
    showSpinner?: boolean
    barSelector?: string
    spinnerSelector?: string
    trickle?: boolean
    trickleFunc?: (n: number) => number
    minimum?: number
  }

  interface NProgressStatic {
    configure(options: NProgressOptions): NProgressStatic
    start(): void
    done(): void
    set(n: number): void
    inc(n?: number): void
    status: number | null
  }

  const NProgress: NProgressStatic
  export default NProgress
}
