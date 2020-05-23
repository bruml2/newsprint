/** newcanvas.js  --  entry for app
 *  v0.1  May 13, 2020
 *  v0.2  May 23: handlebars replaced with nunjucks;
 */
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

const handlers = require('./src/handlers')
// const weatherMiddlware = require('./src/middleware/weather')

const port = process.env.PORT || 8089

app.use(express.static(__dirname + '/public'))

// app.use(weatherMiddlware)

app.get('/', (req, res) => res.render('home.njk', {msg:"Hello World!"}))
app.get('/section-test', (req, res) => res.render('section-test', {layout:"main"}))

app.use(handlers.notFound)
app.use(handlers.serverError)

if(require.main === module) {
  app.listen(port, () => {
    console.log( `Express started on http://localhost:${port}` +
      '; press Ctrl-C to terminate.' )
  })
} else {
  module.exports = app
}
