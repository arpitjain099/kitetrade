const express = require('express')
const app = express()
const sha256 = require('sha256')
const api_key = 'egsewsabj082clgl'
const api_secret = 'zr03ngqmde9m0hi19k31wu9mhh8bp94c'
const request = require('request')
const rp = require('request-promise-native')
const session = require('client-sessions')
let MongoClient = require('mongodb').MongoClient,
  assert = require('assert')

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  console.log('home page clickded')
  res.sendFile(__dirname + '/' + 'index.htm')
})

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}))

app.get('/callback', (req, res) => {
  console.log(req.query.request_token)
  console.log(req.session)

  const getUserAccessToken = {
    method: 'POST',
    uri: 'https://api.kite.trade/session/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      api_key,
      request_token: req.query.request_token,
      checksum: sha256(api_key + req.query.request_token + api_secret)
    },
    json: true,
    resolveWithFullResponse: true
  }
  return rp(getUserAccessToken)
    .then(response => {
      // console.log(response)
      // res.status(200).send(response)
      req.session.user = JSON.stringify(response)
      console.log('\n\n\n')
      console.log(response.body)
      res.redirect('/dashboard')
    })
    .catch(err => {
    	console.log('errAccessToken')
    	console.log(err.message)
    	res.status(400).send({ error: 'error with access_token' })
      // POST failed...
    })
})

app.post('/fetchlimits', (req, res) => {
  console.log('fetchlimits')
  res.status(200).send({
    data: [ {
      profit: 5,
      loss: -5
    } ]
  })
})

app.get('/test', (req, res) => {
  MongoClient.connect('mongodb://localhost', (err, client) => {
    if (err) {
      throw err
    }
    const db = client.db('kitetrade')
    db.collection('userPreferences').find({}, (findErr, result) => {
      if (findErr) {
        throw findErr
      }
      console.log(result)
      res.status(200).send({ result })

      client.close()
    })
  })
})

app.get('/dashboard', (req, res) => {
  if (req.session.user == undefined) {
    res.redirect('/')
  }
  // console.log(JSON.parse(req.session.user))
  const getUserHoldings = {
    method: 'GET',
    uri: 'https://api.kite.trade/portfolio/holdings',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      api_key,
      access_token: JSON.parse(req.session.user).body.data.access_token
    },
    json: true,
    resolveWithFullResponse: true
  }
  return rp(getUserHoldings)
    .then(responseUserHoldings => {
      // console.log(responseUserHoldings.body)

      res.render('dashboard', { holdings: responseUserHoldings })

    })
    .catch(err => {
    	console.log('errHoldings')
    	console.log(err.message)
    	res.status(400).send({ error: 'error with holdings' })
      // POST failed...
    })
})

// res.render('ahaha', { userdata: JSON.stringify(response) })


var server = app.listen(8080, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
