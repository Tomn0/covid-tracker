const express = require('express');
const logger = require('morgan');
const routes = require('./routes');
const app = express();
const pug = require('pug');
const port = 3000;

// Configuring the application
app.set('views', __dirname + '/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug');          //Use the 'Pug' template system

// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Add an HTTP request recorder to the stack — every request will be logged in the console in the 'dev' format
app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory

// Route definitions
app.use('/', routes);

// // this is default in case of unmatched routes
// app.use(function(req, res) {
//   // Invalid request
//         res.json({
//           error: {
//             'name':'Error',
//             'status':404,
//             'message':'Invalid Request',
//             'statusCode':404,
//             'stack':'http://localhost:3000/'
//           },
//            message: 'Testing!'
//         });
//   });

// The application is to listen on port number 3000
app.listen(port, () => console.log(`App listenning at http://localhost:${port}`))
