'use strict'

const DADIAPI = require('@dadi/api-wrapper')
const http = require('http')

const config = {
  api: {
    protocol: 'http',
    host: process.env.API_HOST,
    port: process.env.API_PORT,
    credentials: {
      clientId: process.env.API_CLIENT_ID,
      secret: process.env.API_CLIENT_SECRET
    }
  }
}

function getApi() {
  return new DADIAPI({
    uri: config.api.protocol + '://' + config.api.host,
    port: config.api.port,
    credentials: {
      clientId: config.api.credentials.clientId,
      secret: config.api.credentials.secret
    },
    version: '1.0',
    database: 'cloud'
  })
}

class Data extends Helper {
  //create test client
  async createClient(id, secret) {

    let client = {
      clientId: id,
      secret: secret
    }

    let api = getApi()

    await api
      .inClients()
      .create(client)
      .then(doc => {
        // console.log('New document:', doc)

        // console.log('Obtaining access token')
        return this.getToken()
          .then(result => {
            // console.log('token:', result)

            return this.addResources(JSON.parse(result).accessToken, client).then(result => {
              // console.log('result :', result)
            })
          })
      }).catch(err => {
        console.log('! Error:', err)
      })
  }

  async deleteClient(id) {
    let api = getApi()

    await api
      .inClients()
      .whereClientIs(id)
      .delete()
      .then(() => {
        // console.log('Deleted ' + id)
      }).catch(err => {
        // console.log('! Error:', err)
      })
  }

  async deleteArticleByTitle(title) {
    let api = getApi()

    await api
      .in('articles')
      .whereFieldIsEqualTo('title', title)
      .delete()
      .then(() => {
        // console.log('Deleted ' + title)
      }).catch(err => {
        console.log('! Error:', err)
      })
  }

  getToken() {
    let postData = JSON.stringify(config.api.credentials)
    // console.log("THIS" + postData)

    let options = {
      hostname: config.api.host,
      port: config.api.port,
      path: `/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return this.makeRequest(options, postData)
  }

  async getSessionToken(id, secret) {
    // let postData = JSON.stringify(config.api.credentials)
    let postData = JSON.stringify({
      clientId: id,
      secret: secret
    })

    // console.log("SESSION" + postData)

    let options = {
      hostname: config.api.host,
      port: config.api.port,
      path: `/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return this.makeRequest(options, postData)
  }

  addResources(accessToken, client) {
    let postData = JSON.stringify({
      'name': 'collection:cloud_articles',
      'access': {
        'create': true,
        'delete': true,
        'read': true,
        'update': true
      }
    })

    let options = {
      hostname: config.api.host,
      port: config.api.port,
      path: `/api/clients/${client.clientId}/resources`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }

    return this.makeRequest(options, postData).then(() => {

      postData = JSON.stringify({
        'name': 'collection:cloud_categories',
        'access': {
          'create': true,
          'delete': true,
          'read': true,
          'update': true
        }
      })

      return this.makeRequest(options, postData).then(() => {

        postData = JSON.stringify({
          'name': 'collection:cloud_network-services',
          'access': {
            'create': true,
            'delete': true,
            'read': true,
            'update': true
          }
        })

        return this.makeRequest(options, postData).then(() => {

          postData = JSON.stringify({
            'name': 'collection:cloud_sub-categories',
            'access': {
              'create': true,
              'delete': true,
              'read': true,
              'update': true
            }
          })

          return this.makeRequest(options, postData).then(() => {

            postData = JSON.stringify({
              'name': 'collection:cloud_web-services',
              'access': {
                'create': true,
                'delete': true,
                'read': true,
                'update': true
              }
            })

            return this.makeRequest(options, postData).then(() => {

              postData = JSON.stringify({
                'name': 'collection:cloud_images',
                'access': {
                  'create': true,
                  'delete': true,
                  'read': true,
                  'update': true
                }
              })

              return this.makeRequest(options, postData).then(() => {

                postData = JSON.stringify({
                  'name': 'collection:cloud_team',
                  'access': {
                    'create': true,
                    'delete': true,
                    'read': true,
                    'update': true
                  }
                })

                return this.makeRequest(options, postData)
              })
            })
          })
        })
      })
    })
  }

  async makeRequest(options, postData) {
    // console.log('options :', options)
    // console.log('postData :', postData)

    return new Promise((resolve, reject) => {
      let req = http.request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`)
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)

        let data = ''

        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          // console.log(`BODY: ${chunk}`)
          data += chunk
        })

        res.on('end', () => {
          return resolve(data)
        })
      })

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`)
        return reject(e)
      })

      if (postData) {
        // write data to request body
        req.write(postData)
      }

      req.end()
    })
  }
}

module.exports = Data