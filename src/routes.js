const { response } = require('express');
var express = require('express');
var axios = require('axios');
const https = require("https");
var router = express.Router();

// Home page route.
router.get('/', (req, res) => {
  const apiUrl = "https://api.covid19api.com/summary";
  const countries = axios.get(apiUrl).then((response) => {
      res.render("home", {
        appName: "My COVID-19 Tracker",
        pageName: "COVID-19 Cases - summary",
        data: response.data.Countries,
      });
    })
    .catch(function (err) {
      return console.error(err);
    });
});

router.get('/byCountryLive', (req, res)  => {
  var from = req.params.date1;  //2020-05-06T00:00:00Z
  var to = req.params.date2;    //2020-05-09T00:00:00Z


  const url = "https://api.covid19api.com/country/poland/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-09T00:00:00Z";
  console.log("url: " + url);

  console.log(req.path);
  
  const countries = [];

  https.get(url, response => {
    response.setEncoding("utf8");
    let body = "";
    response.on("data", data => {
      body += data;
    });
    response.on("end", () => {
      body = JSON.parse(body);
      console.log(body);
      res.render("table", {
        appName: "My COVID-19 Tracker",
        pageName: "COVID-19 Cases",
        data: body,
      });
      // res.write(body);

    });
  });

});


router.get('/byCountryLive/:date1/:date2/:first*', (req, res)  => {
  var from = req.params.date1;  //2020-05-06T00:00:00Z
  var to = req.params.date2;    //2020-05-09T00:00:00Z


  const url = "https://api.covid19api.com/country/poland/status/confirmed/live?from=" + from + "&to=" + to;
  console.log("url: " + url);

  // get all requested countries
  console.log(req.path);

  var req_countries = req.path.split("/");


  for (var i = 3; i < req_countries.length; i++) {
    console.log(req_countries[i]);
  }

  // var first_country = req.params.first;

  // console.log(first_country);

  const requestOne = axios.get("https://api.covid19api.com/country/poland/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-09T00:00:00Z");
  const requestTwo = axios.get("https://api.covid19api.com/country/germany/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-09T00:00:00Z");
  const requestThree = axios.get("https://api.covid19api.com/country/france/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-09T00:00:00Z");

  const countries = axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
    console.log(responses[0]);
    console.log(response[1]);
    console.log(response[2]);

  })).catch(error => {
    console.log(error);
  });
});

// About page
router.get('/about', function (req, res) {
  res.render('about');
  // res.send('This app show some basic infos and statistics about COVID19 pandemic. Source: TODO, <a href="/"> Go to the home page</a>');

})

module.exports = router;
