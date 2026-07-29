import next from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

// BUILD-1: flat config for ESLint 10 (replaces the removed `next lint` + legacy
// .eslintrc.json). Mirrors the old config: next/core-web-vitals + prettier, with
// @next/next/no-img-element disabled (the site intentionally uses raw <img> in places).
export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'types/database.types.ts'],
  },
  ...next,
  prettier,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // ponytail: react-19-era purity rules fire on working code (HomeKV carousel
      // reset) and vendored shadcn (skeleton Math.random). Keep them visible as
      // warnings instead of hard-failing lint on a pre-existing codebase.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
]
