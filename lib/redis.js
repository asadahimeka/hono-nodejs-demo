import { Redis } from 'ioredis'
import { REDIS_URI } from './env.js'

const db = {
  /** @type {Redis} */
  _client: null,

  init () {
    if (this._client || !REDIS_URI) return
    console.log('init redis client')
    this._client = new Redis(REDIS_URI)
  },

  async get (key) {
    try {
      this.init()
      const res = await this._client.get(key)
      return JSON.parse(res)
    } catch {
      return null
    }
  },

  async set (key, val, expire) {
    try {
      this.init()
      const args = [key, JSON.stringify(val)]
      if (expire) args.push('EX', expire)
      await this._client.set(...args)
    } catch (err) {
      console.log('Redis set err: ', err)
    }
  },

  close () {
    console.log('disconnect redis client')
    this._client && this._client.disconnect()
  }
}

export default db
