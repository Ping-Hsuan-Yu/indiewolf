import { usePageContext } from 'vike-react/usePageContext';
import { redirect } from 'vike/abort'

export default function Page() {
}

export async function onBeforeRender() {
  throw redirect(`/indiewolf/manga/2023`)
}