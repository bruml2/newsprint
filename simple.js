/** simple.js  --  entry for app
 *  v0.1  May 13, 2020
 */
const express = require('express')
const expressHandlebars = require('express-handlebars')

// const handlers = require('./src/handlers')

const app = express()
const port = process.env.PORT || 8080
// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  extname: '.hbs',
  defaultLayout: 'home',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => res.render('home', {layout:'home'}))

app.use((req, res) => res.render('404', {layout: 'home'}))
app.use((err, req, res, next) => res.render('500', {layout: 'home'}))

if(require.main === module) {
  app.listen(port, () => {
    console.log( `Express started on http://localhost:${port}`)
  })
} else {
  module.exports = app
}
