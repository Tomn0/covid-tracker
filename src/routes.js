var express = require('express');
var router = express.Router();

// Home page
router.get('/', function (req, res) {
  res.render('home');
  // res.send('Hello world! Learn <a href="/about"> about</a> this app');
})

// About page
router.get('/about', function (req, res) {
  res.render('about');
  // res.send('This app show some basic infos and statistics about COVID19 pandemic. Source: TODO, <a href="/"> Go to the home page</a>');

})


module.exports = router;
