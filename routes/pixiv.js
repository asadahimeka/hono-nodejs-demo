import db from '../lib/redis.js'
import { getActionMap } from '../lib/pixiv-action.js'

/**
 * @param {import('hono').Context} ctx
 */
export default async function pixiv (ctx) {
  try {
    const reqUrl = new URL(ctx.req.url)
    const url = reqUrl.pathname + reqUrl.search

    if (url.includes('/pixiv/rank?_t=')) return ctx.text('ok', 200)

    let data = await db.get(url)
    if (!data) {
      console.log(`Cache of ${url} hit: false`)
      ctx.header('X-Cache-Hit', 'false')
      const act = (await getActionMap())[`/${ctx.req.param('key')}`]
      if (!act) return ctx.text('Bad Request', 400)
      data = await act.fn({ query: ctx.req.query() })
      if (data.next_url === null && data.illusts && data.illusts.length === 0) {
        ctx.header('Cache-Control', 'max-age=0')
      } else {
        await db.set(url, data, act.expire)
        ctx.header('Cache-Control', 'max-age=600, s-maxage=600')
      }
    } else {
      console.log(`Cache of ${url} hit: true`)
      ctx.header('X-Cache-Hit', 'true')
      ctx.header('Cache-Control', 'max-age=600, s-maxage=600')
    }

    return ctx.json(data, 200)
  } catch (err) {
    console.log('req err: ', err.message)
    return ctx.json({ error: err.message }, 500)
  }
}
