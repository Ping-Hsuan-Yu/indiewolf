// Pure Cloudinary URL → public_id parsing, extracted from deleteCloudinaryImage so
// this fragile string logic can be unit-tested (MAINT-4).
//
// The public_id is everything after the version segment (vNNN), minus the file
// extension. Transformation segments (if any) always precede the version, so keying
// off the version segment skips them too. The secure_url values this app stores are
// un-transformed (…/upload/vNNN/folder/name.ext), but handling a leading transform
// segment costs nothing and is safer.
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url) return null

  const parts = url.split('/upload/')
  if (parts.length < 2) return null

  let path = parts[1]

  const version = path.match(/(?:^|\/)v\d+\//)
  if (version) {
    path = path.slice(version.index! + version[0].length)
  }

  // Strip only the trailing extension; keep dots inside a nested public_id.
  return path.split('.').slice(0, -1).join('.') || path
}
