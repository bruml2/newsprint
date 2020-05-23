// exports.home = (req, res) => res.render('home', {layout:"home"})

// exports.sectionTest = (req, res) => res.render('section-test')

exports.notFound = (req, res) => res.render('404', {layout: 'home'})

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500', {layout: 'home'})
/* eslint-enable no-unused-vars */
