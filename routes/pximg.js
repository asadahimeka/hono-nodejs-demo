/**
 * @param {import('hono').Context} ctx
 */
export default async function pximg (ctx) {
  try {
    const { path } = ctx.req
    if (!path.startsWith('/pximg/')) return ctx.text('Bad Request.', 400)
    const res = await fetch(`https://i.pximg.net/${path.replace('/pximg/', '')}`, {
      headers: {
        Referer: 'https://www.pixiv.net/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    return ctx.body(res.body, 200, {
      'Content-Type': res.headers.get('Content-Type'),
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000'
    })
  } catch (err) {
    console.log('req err: ', err.message)
    return ctx.json({ error: err.message }, 500)
  }
}
