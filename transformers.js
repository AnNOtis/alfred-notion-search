import { get } from 'lodash'

export function getDomain(spaceInfo) {
  return get(spaceInfo, 'results[0].domain')
}

function getTitle(block) {
  return get(block, 'properties.title[0][0]')
}

function findBlock(response, id) {
  return get(response, `recordMap.block[${id}].value`)
}

function findIcon(response, id) {
  const block = findBlock(response, id)
  if (!block) return
  const icon = get(block, 'format.page_icon')
  return icon ? icon : findIcon(response, block.parent_id)
}

function findBreadcrumb(response, id, result = []) {
  const block = findBlock(response, id)
  if (!block) return result
  if (block.type === 'page') {
    const title = getTitle(block)
    result.unshift(title)
  }
  return findBreadcrumb(response, block.parent_id, result)
}

function findParentPage(response, id) {
  const block = findBlock(response, id)
  if (!block) return {}
  if (block.type === 'page') {
    return block
  } else {
    return findParentPage(response, block.parent_id)
  }
}

function sortByPageFirst(output) {
  return output.sort((a, b) => {
    if (a._type === 'page' && b._type === 'page') {
      return b._score - a._score
    }

    if (a._type === 'page') {
      return -1
    } else if (b._type === 'page') {
      return 1
    } else {
      return b._score - a._score
    }
  })
}

function getLink(domain, id, anchorId) {
  const anchor = anchorId ? `#${anchorId.replace(/-/g, '')}` : ''
  // if x- not exist, the link will not be found.
  return `notion://www.notion.so/${domain}/x-${id.replace(/-/g, '')}${anchor}`
}

function isCustomIcon (icon) {
  return /^https/.test(icon)
}

const noResultMessage = {
  title: "❌ Empty Result",
  subtitle: "Try another keyword",
  autocomplete: "",
  icon: {
    path: './icon.png'
  }
}

export function mapSearchToAlfredOutput(domain, searchResponse) {
  const output = searchResponse.results.map(item => {
    const { id, score } = item
    const block = findBlock(searchResponse, id)
    const icon = findIcon(searchResponse, id)
    const breadcrumbs = findBreadcrumb(searchResponse, id).join(' / ')
    let title = get(block, 'properties.title[0][0]')
    const link =
      block.type === 'page'
        ? getLink(domain, block.id)
        : getLink(domain, findParentPage(searchResponse, id).id, block.id)

    return {
      _score: score,
      _type: block.type,
      title: (icon && !isCustomIcon(icon)) ? `${icon} ${title}` : title,
      subtitle: breadcrumbs,
      arg: link,
      icon: {
        path: './icon.png'
      }
    }
  })

  return output.length ? output : [noResultMessage]
}
