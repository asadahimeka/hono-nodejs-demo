/**
 * @param {import('hono').Context} ctx
 */
export default async function pixivApiProxy (ctx) {
  try {
    const url = new URL(ctx.req.url)
    if (url.pathname.startsWith('/pixiv-app-api/')) {
      url.host = 'app-api.pixiv.net'
      url.pathname = url.pathname.replace('/pixiv-app-api', '')
    } else if (url.pathname.startsWith('/pixiv-oauth/')) {
      url.host = 'oauth.secure.pixiv.net'
      url.pathname = url.pathname.replace('/pixiv-oauth', '')
    } else {
      return ctx.text('Bad Request', 400)
    }

    const reqHeaders = {
      'App-OS': 'Android',
      'App-OS-Version': 'Android 13.0',
      'App-Version': '6.102.0',
      'Accept-Language': 'zh-CN',
      'User-Agent': 'PixivAndroidApp/6.102.0 (Android 13.0; Pixel 7)'
    }

    if (ctx.req.header('Authorization')) {
      reqHeaders.Authorization = ctx.req.header('Authorization')
    }
    if (ctx.req.header('Content-Type')) {
      reqHeaders['Content-Type'] = ctx.req.header('Content-Type')
    }
    if (ctx.req.header('X-Client-Time')) {
      reqHeaders['X-Client-Time'] = ctx.req.header('X-Client-Time')
    }
    if (ctx.req.header('X-Client-Hash')) {
      reqHeaders['X-Client-Hash'] = ctx.req.header('X-Client-Hash')
    }

    const resp = await fetch(url.href, {
      method: ctx.req.method,
      body: ctx.req.raw.body,
      headers: reqHeaders
    })

    ctx.header('Content-Type', resp.headers.get('Content-Type'))
    return ctx.body(resp.body, resp.status)
  } catch (err) {
    console.log('req err: ', err.message)
    return ctx.json({ error: err.message }, 500)
  }
}
