const fetch = require('node-fetch')
const normalizeUrl = require('normalize-url')
const validUrl = require('../lib/validUrl')
const { JSDOM } = require('jsdom')
const Readability = require('readability/Readability')

module.exports = async function read(url) {
  // validate URL
  let normalizedUrl
  try {
    normalizedUrl = normalizeUrl(url)
    if (!validUrl(normalizedUrl)) throw Error()
  } catch (error) {
    throw Error(`Invalid URL ${normalizedUrl}`)
  }
  // fetch page
  let text
  try {
    const response = await fetch(normalizedUrl)
    text = await response.text()
  } catch (error) {
    throw Error(`Failed to Fetch ${normalizedUrl}`)
  }
  // extract article
  try {
    const dom = new JSDOM(text, { url: normalizedUrl })
    const article = new Readability(dom.window.document).parse()
    if (!article) throw Error()
    return { normalizedUrl, ...article }
  } catch (error) {
    throw Error(`Failed to extract article ${url}`)
  }
}
