import { createAssetServer } from 'remix/assets'

const rootDir = process.cwd()
const nodeEnv = process.env.NODE_ENV ?? 'development'
const isDevelopment = nodeEnv === 'development'

export const assetServer = createAssetServer({
  basePath: '/assets',
  rootDir,
  allowFiles: ['app/assets/**'],
  // Packages the browser entry imports (served from node_modules, resolved via the import map).
  allowPackages: ['remix', '@remix-run/component'],
  sourceMaps: isDevelopment ? 'external' : undefined,
  minify: !isDevelopment,
  watch: false,
})

// href + preloads + import map for the client entry (Remix 3.1 resolves bare imports via the map).
export const scriptEntry = await assetServer.getScriptEntry('app/assets/entry.ts')
