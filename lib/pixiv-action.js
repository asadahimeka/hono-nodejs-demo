import PixivApi from './pixiv-api.js'

const actionMap = {}
const app = {
  get: (url, fn, expire) => {
    actionMap[url] = { fn, expire }
  }
}

function initApp () {
  const pixiv = new PixivApi()
  // app.get('/me', async () => {
  //   const res = await pixiv.authInfo()
  //   if (!res?.user) throw new Error('Not login.')
  //   return res.user
  // })
  app.get('/illust', async req => {
    return pixiv.illustDetail(req.query.id)
  }, 60 * 60 * 72)
  app.get('/member', async req => {
    return pixiv.userDetail(req.query.id)
  }, 60 * 60 * 24)
  app.get('/illust_recommended', async req => {
    return pixiv.illustRecommended({
      include_privacy_policy: false,
      include_ranking_illusts: false,
      ...req.query
    })
  }, 60 * 60 * 12)
  app.get('/user_recommended', async req => {
    return pixiv.userRecommended({
      ...req.query
    })
  }, 60 * 60 * 12)
  app.get('/illust_new', async req => {
    return pixiv.illustNew({
      content_type: 'illust',
      ...req.query
    })
  }, 60 * 10)
  app.get('/manga_new', async req => {
    return pixiv.mangaNew({
      ...req.query
    })
  }, 60 * 10)
  app.get('/novel_new', async req => {
    return pixiv.novelNew({
      ...req.query
    })
  }, 60 * 10)
  app.get('/search_autocomplete', async req => {
    return pixiv.searchAutoCompleteV2(req.query.word)
  }, 60 * 60 * 72)
  app.get('/popular_preview', async req => {
    return pixiv.searchIllustPopularPreview(req.query.word, {
      include_translated_tag_results: 'true',
      merge_plain_keyword_results: 'true',
      search_target: 'partial_match_for_tags',
      ...req.query
    })
  }, 60 * 60 * 48)
  app.get('/popular_preview_novel', async req => {
    return pixiv.searchNovelPopularPreview(req.query.word, {
      include_translated_tag_results: 'true',
      merge_plain_keyword_results: 'true',
      search_target: 'partial_match_for_tags',
      ...req.query
    })
  }, 60 * 60 * 48)
  app.get('/search_user', async req => {
    const { word, page = 1, size = 30 } = req.query
    return pixiv.searchUser(word, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 24)
  app.get('/member_illust', async req => {
    const { id, illust_type = 'illust', page = 1, size = 30 } = req.query
    return pixiv.userIllusts(id, {
      type: illust_type,
      offset: (page - 1) * size
    })
  }, 60 * 60 * 6)
  app.get('/member_novel', async req => {
    const { id, page = 1, size = 30 } = req.query
    return pixiv.userNovels(id, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 6)
  app.get('/favorite', async req => {
    const { id, ...opts } = req.query
    if (opts.max_bookmark_id == 0) delete opts.max_bookmark_id
    return pixiv.userBookmarksIllust(id, opts)
  }, 60 * 60 * 12)
  app.get('/favorite_novel', async req => {
    const { id, ...opts } = req.query
    return pixiv.userBookmarksNovel(id, opts)
  }, 60 * 60 * 12)
  app.get('/follower', async req => {
    const { id, page = 1, size = 30 } = req.query
    return pixiv.userFollower(id, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 1)
  app.get('/following', async req => {
    const { id, page = 1, size = 30 } = req.query
    return pixiv.userFollowing(id, {
      offset: (page - 1) * size
    })
  }, 60 * 10)
  app.get('/rank', async req => {
    const { page = 1, size = 30, ...opts } = req.query
    return pixiv.illustRanking({
      offset: (page - 1) * size,
      ...opts
    })
  }, 60 * 60 * 24 * 14)
  app.get('/rank_novel', async req => {
    const { page = 1, size = 30, ...opts } = req.query
    return pixiv.novelRanking({
      offset: (page - 1) * size,
      ...opts
    })
  }, 60 * 60 * 24 * 14)
  app.get('/search', async req => {
    const {
      word,
      page = 1,
      size = 30,
      mode = 'partial_match_for_tags',
      order = 'date_desc',
      ...opts
    } = req.query
    return pixiv.searchIllust(word, {
      offset: (page - 1) * size,
      include_translated_tag_results: true,
      merge_plain_keyword_results: true,
      search_target: mode,
      sort: order,
      ...opts
    })
  }, 60 * 60 * 1)
  app.get('/search_novel', async req => {
    const {
      word,
      page = 1,
      size = 30,
      mode = 'partial_match_for_tags',
      sort = 'date_desc',
      ...opts
    } = req.query
    return pixiv.searchNovel(word, {
      offset: (page - 1) * size,
      include_translated_tag_results: true,
      merge_plain_keyword_results: true,
      search_target: mode,
      sort,
      ...opts
    })
  }, 60 * 60 * 1)
  app.get('/tags', async req => {
    return pixiv.trendingTagsIllust(req.query)
  }, 60 * 60 * 12)
  app.get('/tags_novel', async req => {
    return pixiv.trendingTagsNovel(req.query)
  }, 60 * 60 * 12)
  app.get('/related', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.illustRelated(id, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 72)
  app.get('/related_novel', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.novelRelated(id, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 72)
  app.get('/related_member', async req => {
    const { id } = req.query
    return pixiv.userRelated(id)
  }, 60 * 60 * 72)
  app.get('/ugoira_metadata', async req => {
    const { id } = req.query
    return pixiv.ugoiraMetaData(id)
  }, 60 * 60 * 72)
  app.get('/illust_comments', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.illustCommentsV3(id, {
      offset: (page - 1) * size
    })
  }, 60 * 10)
  app.get('/novel_comments', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.novelCommentsV3(id, {
      offset: (page - 1) * size
    })
  }, 60 * 10)
  app.get('/illust_comment_replies', async req => {
    const { id } = req.query
    return pixiv.illustCommentReplies(id)
  }, 60 * 10)
  app.get('/novel_comment_replies', async req => {
    const { id } = req.query
    return pixiv.novelCommentReplies(id)
  }, 60 * 10)
  app.get('/manga_recommended', async req => {
    return pixiv.mangaRecommended(req.query)
  }, 60 * 60 * 12)
  app.get('/novel_recommended', async req => {
    return pixiv.novelRecommended(req.query)
  }, 60 * 60 * 12)
  app.get('/novel_series', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.novelSeries(id, {
      last_order: (page - 1) * size
    })
  }, 60 * 60 * 24)
  app.get('/illust_series', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.illustSeries(id, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 24)
  app.get('/member_illust_series', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.userIllustSeries(id, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 24)
  app.get('/member_novel_series', async req => {
    const { page = 1, size = 30, id } = req.query
    return pixiv.userNovelSeries(id, {
      offset: (page - 1) * size
    })
  }, 60 * 60 * 24)
  app.get('/novel_detail', async req => {
    const { id } = req.query
    return pixiv.novelDetail(id)
  }, 60 * 60 * 12)
  app.get('/novel_text', async req => {
    const { id } = req.query
    return pixiv.novelText(id)
  }, 60 * 60 * 12)
  app.get('/webview_novel', async req => {
    const { id, raw } = req.query
    return pixiv.webviewNovel(id, raw == 'true')
  }, 60 * 60 * 12)
  app.get('/live_list', async req => {
    const { page = 1, size = 30 } = req.query
    const params = {}
    if (page > 1) params.offset = (page - 1) * size
    return pixiv.liveList(params)
  }, 60)
  app.get('/req_get', async req => {
    const { path, params } = req.query
    const fns = {
      'v2/illust/follow': () => pixiv.illustFollow(JSON.parse(params))
    }
    return fns[path]?.()
  }, 0)
  app.get('/req_post', async req => {
    const { path, data } = req.query
    const d = JSON.parse(data)
    const fns = {
      'v2/illust/bookmark/add': () => pixiv.bookmarkIllust(d.illust_id),
      'v1/illust/bookmark/delete': () => pixiv.unbookmarkIllust(d.illust_id),
      'v1/user/follow/add': () => pixiv.followUser(d.user_id),
      'v1/user/follow/delete': () => pixiv.unfollowUser(d.user_id)
    }
    return fns[path]?.()
  }, 0)
}

export async function getActionMap () {
  try {
    if (actionMap['/illust']) return actionMap
    console.log('init action map')
    initApp()
    return actionMap
  } catch (err) {
    console.log('Start err:', err)
  }
}
