declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ALCHEMY_KEY: string
    }
  }
}