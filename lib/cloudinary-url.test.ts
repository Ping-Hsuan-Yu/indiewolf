import assert from 'node:assert/strict'
import { test } from 'node:test'

import { extractCloudinaryPublicId } from './cloudinary-url'

const BASE = 'https://res.cloudinary.com/demo/image/upload'

test('standard upload url with version + folder', () => {
  assert.equal(
    extractCloudinaryPublicId(`${BASE}/v1699999999/indiewolf/manga/abc123.jpg`),
    'indiewolf/manga/abc123'
  )
})

test('url without a version segment', () => {
  assert.equal(
    extractCloudinaryPublicId(`${BASE}/indiewolf/social_icons/logo.png`),
    'indiewolf/social_icons/logo'
  )
})

test('transformation segment before the version is skipped', () => {
  assert.equal(
    extractCloudinaryPublicId(`${BASE}/f_auto,q_auto/v123/indiewolf/manga/x.webp`),
    'indiewolf/manga/x'
  )
})

test('dots inside the public_id are preserved, only the extension is stripped', () => {
  assert.equal(
    extractCloudinaryPublicId(`${BASE}/v1/folder/my.file.name.jpg`),
    'folder/my.file.name'
  )
})

test('public_id with no extension', () => {
  assert.equal(extractCloudinaryPublicId(`${BASE}/v1/folder/name`), 'folder/name')
})

test('url with no /upload/ segment returns null', () => {
  assert.equal(extractCloudinaryPublicId('https://example.com/foo.jpg'), null)
})

test('empty / missing input returns null', () => {
  assert.equal(extractCloudinaryPublicId(''), null)
  // @ts-expect-error exercising the runtime guard
  assert.equal(extractCloudinaryPublicId(undefined), null)
})
