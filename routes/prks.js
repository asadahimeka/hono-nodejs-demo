/**
 * @param {import('hono').Context} ctx
 */
export default async function prks (ctx) {
  try {
    let reqUrl = new URL(ctx.req.url)
    reqUrl = reqUrl.pathname.slice(1) + reqUrl.search
    if (!/^https?:\//.test(reqUrl)) return ctx.text('Bad Request', 400)
    if (/https?:\/\w+/.test(reqUrl)) reqUrl = reqUrl.replace(/(https?:\/)/, '$1/')
    reqUrl = new URL(reqUrl)

    const reqHeaders = {}
    const delHeaderKeys = [
      'cf-visitor',
      'x-real-ip',
      'x-vercel-proxied-for',
      'cf-connecting-ip',
      'cdn-loop',
      'cf-ray',
      'x-vercel-ip-latitude',
      'x-vercel-forwarded-for',
      'forwarded',
      'x-vercel-id',
      'x-vercel-deployment-url',
      'x-forwarded-host',
      'x-vercel-ip-longitude',
      'x-forwarded-proto',
      'cf-ipcountry',
      'x-vercel-ip-country-region',
      'x-vercel-ip-timezone',
      'x-forwarded-for',
      'x-vercel-proxy-signature-ts',
      'x-vercel-ip-city',
      'x-vercel-ip-country',
      'x-vercel-proxy-signature',
      'x-middleware-invoke',
      'x-invoke-path',
      'x-invoke-query',
      'x-invoke-output',
      'x-forwarded-port'
    ]
    Object.keys(ctx.req.header()).forEach(h => {
      if (!delHeaderKeys.includes(h.toLowerCase())) {
        reqHeaders[h] = ctx.req.header(h)
      }
    })

    const resp = await fetch(reqUrl.href, {
      headers: {
        ...reqHeaders,
        host: reqUrl.host,
        origin: reqUrl.origin,
        referer: reqUrl.origin + '/'
      }
    })

    const respHeaders = { 'Content-Type': resp.headers.get('Content-Type') }
    if (resp.headers.get('Cache-Control')) respHeaders['Cache-Control'] = resp.headers.get('Cache-Control')
    if (resp.headers.get('Content-Encoding')) respHeaders['Content-Encoding'] = resp.headers.get('Content-Encoding')

    return ctx.body(resp.body, resp.status, respHeaders)
  } catch (err) {
    console.log('req err: ', err.message)
    return ctx.json({ error: err.message }, 500)
  }
}
