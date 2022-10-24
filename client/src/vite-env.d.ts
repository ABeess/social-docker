/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_APP_LIVE_STREAM_LINK: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
