import { isbot } from 'isbot'
import { ACCEPT_DOMAINS, UA_BLACKLIST } from './env.js'

/**
 * @param {import('hono').Context} ctx
 */
export function isAccepted (ctx) {
  const ua = ctx.req.header('User-Agent')
  const origin = ctx.req.header('Origin')
  const referer = ctx.req.header('Referer')

  if (!ua) return false
  if (isbot(ua)) return false
  try {
    const uaOk = !UA_BLACKLIST.some(e => ua.toLowerCase().includes(e))
    const originOk = origin ? ACCEPT_DOMAINS.some(e => origin.includes(e)) : true
    const refererOk = referer ? ACCEPT_DOMAINS.some(e => referer.includes(e)) : true

    return uaOk && (originOk || refererOk)
  } catch (e) {
    return false
  }
}
