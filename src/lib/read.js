const fetch = require('node-fetch')
const normalizeUrl = require('normalize-url')
const validUrl = require('../lib/validUrl')
const { JSDOM } = require('jsdom')
const Readability = require('readability/Readability')

module.exports = async function read(url) {
  // validate URL
  try {
    url = normalizeUrl(url)
    if (!validUrl(url)) throw Error()
  } catch (error) {
    throw Error(`Invalid URL ${url}`)
  }
  // fetch page
  let text
  try {
    const response = await fetch(url)
    text = await response.text()
  } catch (error) {
    throw Error(`Failed to Fetch ${url}`)
  }
  // extract article
  try {
    const dom = new JSDOM(text, { url })
    const article = new Readability(dom.window.document).parse()
    return article
  } catch (error) {
    throw Error(`Failed to extract article ${url}`)
  }
}
