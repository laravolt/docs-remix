import { get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  llmsTxt: get('/llms.txt'),
  llmsFullTxt: get('/llms-full.txt'),
  home: get('/'),
  page: get('/*path'),
})
