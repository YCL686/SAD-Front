/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_BASE_SERVER: string
  readonly VITE_CHAIN_NETWORK: string
  readonly VITE_CHAIN_ID: number
  readonly VITE_CONTRACT_OWNER_ADDRESS: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_DEPOSIT_WITHDRAW_ADDRESS: string
  readonly VITE_SIGN_MESSAGE: string
  readonly VITE_CONTRACT_ABI: string
  readonly VITE_DEPOSIT_MESSAGE: string
  readonly VITE_WITHDRAW_MESSAGE: string
}


declare module '*.vue' {
  import type { DefineComponent, readonly, readonly, readonly, readonly } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}