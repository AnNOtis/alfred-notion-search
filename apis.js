import alfy from 'alfy'

const token = process.env.token_v2
const spaceId = process.env.space_id

const fetch = alfy.fetch

export const fetchSpaceInfo = async () => {
  let result = alfy.cache.get('spaceInfo')
  if (result) return result

  result = await fetch('https://www.notion.so/api/v3/getPublicSpaceData', {
    method: 'POST',
    headers: {
      accept: '*/*',
      'content-type': 'application/json'
    },
    body: { type: 'space-ids', spaceIds: [spaceId] }
  })
  alfy.cache.set('spaceInfo', result)
  return result
}

export const search = async (q) =>
  fetch('https://www.notion.so/api/v3/search', {
    method: 'POST',
    headers: {
      cookie: `token_v2=${token}`,
      accept: '*/*',
      'content-type': 'application/json'
    },
    body: {
      type: 'BlocksInSpace',
      query: q,
      spaceId,
      limit: 20,
      filters: {
        isDeletedOnly: false,
        excludeTemplates: false,
        isNavigableOnly: false,
        requireEditPermissions: false,
        ancestors: [],
        createdBy: [],
        editedBy: [],
        lastEditedTime: {},
        createdTime: {}
      },
      sort: 'Relevance',
      source: 'quick_find'
    }
  })
