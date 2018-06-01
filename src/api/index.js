const path = require('path')
const joi = require('joi')
const fetch = require('node-fetch')
const normalizeUrl = require('normalize-url')
const validUrl = require('../lib/validUrl')
const { JSDOM } = require('jsdom')
const Readability = require('readability/Readability')

async function read(url) {
  // validate URL
  try {
    url = normalizeUrl(url)
    if (!validUrl(url)) throw new Error('Invalid URL')
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

module.exports = {
  name: 'ApiPlugin',
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/favicon.ico',
        handler: (request, h) => {
          return h.file('public/favicon.ico')
        }
      },
      {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
          return h.view('index')
        }
      },
      {
        method: 'GET',
        path: '/{params*}',
        handler: async (request, h) => {
          console.log('params111')
          try {
            const url = request.url.path.substring(1)
            const { title, content } = await read(url)
            return h.view('index', {
              title: `${title} | `,
              unsafebody: content,
              url
            })
          } catch (error) {
            return h.view('index', { unsafebody: `<p>${error.message}</p>` })
          }
        }
      },
      {
        method: 'GET',
        path: '/read',
        handler: async (request, h) => {
          return h.redirect(`/${request.query.url}`)
        },
        options: {
          validate: {
            query: {
              mode: joi
                .string()
                .valid(['read'])
                .required(),
              url: joi.string().required()
            }
          }
        }
      }
    ])
  }
}
