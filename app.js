import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
// import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'
import { etag } from 'hono/etag'
import { isAccepted } from './lib/util.js'
import pximg from './routes/pximg.js'
import pixiv from './routes/pixiv.js'
import pixivApiProxy from './routes/pixiv-api-proxy.js'
import prks from './routes/prks.js'

const app = new Hono()

// app.use(logger())
app.use(cors())
app.use(compress())
app.use(etag())
app.use(async (ctx, next) => {
  console.log(ctx.req.method, ctx.req.path, ctx.req.header('User-Agent'), ctx.req.header('Origin'))
  if (!isAccepted(ctx)) return ctx.text('403 Forbidden', 403)
  await next()
})

app.get('/', ctx => ctx.text('Hello World.'))
app.get('/pximg/*', pximg)
app.get('/api/pixiv/:key', pixiv)
app.get('/pixiv-app-api/*', pixivApiProxy)
app.get('/pixiv-oauth/*', pixivApiProxy)

app.use('/robots.txt', serveStatic({ path: './public/robots.txt' }))
app.use('/favicon.ico', async (ctx, next) => {
  ctx.header('Cache-Control', 'public, max-age=31536000, s-maxage=31536000')
  await next()
}, serveStatic({ path: './public/favicon.ico' }))

app.get('/*', prks)

serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
}, info => {
  console.log(`Listening on http://localhost:${info.port}`)
})
