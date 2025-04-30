import { redirect } from 'vike/abort'

export default function Page() {
  // 此頁面不會被渲染，因為會立即重導
}

export async function onBeforeRender() {
  throw redirect(`/indiewolf/illustration/2025`)
}