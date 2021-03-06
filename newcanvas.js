/** newcanvas.js  --  entry for app
 *  v0.1  May 13, 2020
 *  v0.2  May 23: handlebars replaced with nunjucks;
 *  v0.3  May 24: courses webscrapping and middleware;
 */
'use strict';
const port = process.env.PORT || 8089
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
// this eliminates the need for extensions on the view filenames;
//  => include them anyway!
app.set('view engine', 'njk')
const path = require('path')

const handlers = require('./src/handlers')
const coursesMiddleware = require('./src/middleware/courses.js')

app.use(express.static(path.join(__dirname, '/public')))
app.use(coursesMiddleware)

app.get('/', (req, res) => {
  console.log('in get')
  console.dir(res.locals)
  res.render('home.njk', {msg:"Hello World!"})
})

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
