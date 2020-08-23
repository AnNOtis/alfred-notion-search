import alfy from 'alfy'
import { fetchSpaceInfo, search } from './apis'
import { mapSearchToAlfredOutput, getDomain } from './transformers'

const spaceInfo = await fetchSpaceInfo()
const domain = getDomain(spaceInfo)

const searchResponse = await search(alfy.input.normalize())
const result = mapSearchToAlfredOutput(domain, searchResponse)

alfy.output(result)
