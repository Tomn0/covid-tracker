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
  // Dates
  var from = req.params.date1;  //2020-05-06T00:00:00Z
  var to = req.params.date2;    //2020-05-09T00:00:00Z


  const url = "https://api.covid19api.com/country/poland/status/confirmed/live?from=" + from + "&to=" + to;

  var req_countries = req.path.split("/");

  let countries = [];
  let requests = [];
  // make requests
  for (var i = 4; i < req_countries.length; i++) {
    let country = req_countries[i];

    countries.push(country);
    // console.log(country);

    let request = axios.get("https://api.covid19api.com/country/" + country.toLowerCase() + "/status/confirmed/live?from=" + from + "&to=" + to);
    requests.push(request);

  }

  // console.log('Countries: ', countries);
  // console.log('Requests: ', requests);

  // const requestOne = axios.get("https://api.covid19api.com/country/poland/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-09T00:00:00Z");
  // const requestTwo = axios.get("https://api.covid19api.com/country/germany/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-09T00:00:00Z");
  // const requestThree = axios.get("https://api.covid19api.com/country/france/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-09T00:00:00Z");

 axios.all(requests)
  .then(axios.spread((...responses) => {
    // console.log(responses[0]);
    // console.log(responses[1]);
    // console.log(responses[2]);


    let final = [];
    // creting table header]
    final[0] = ["Data"];
    countries.forEach(country =>{
      final[0].push(country);
    });
    

    // number of rows in table without the table header
    let iter = 0;

    // how many dates:
    let datesNum = responses[0].data.length;

    // how many responses:
    let responsesNum = responses.length;

    console.log(datesNum);
    console.log(responsesNum);


    while (iter < datesNum && iter < 100) {
      iter++;
      let row = [];
      let date = responses[0].data[iter - 1]["Date"];
      console.log("Date: ", date);
      row[0] = date.split('T')[0];

      for (var i = 0; i < responsesNum; i++) {
        let cases = responses[i].data[iter - 1]["Cases"];
        row.push(cases);
      }
      console.log("Adding row: ", row);

      // dodajemy od 1 bo 0 to już nagłówek
      final[iter] = row;
      
    }

    console.log("Final: ", final);
    

    // responses.forEach(element => {

    //   let newObj = {};
    //   // element.data is one response's data in the form of an array: 
    //   // [ {Country: 'Poland', Cases: 15366, Date: '2020-05-08T00:00:00Z...}, {Country: 'Poland', Cases: ... Date: ...} ]

    //   // data will be indexed by date
    //   element.data.forEach(obj => {
    //     let firstDate = from.split('T')[0];
    //   });
    //   responses[responses.indexOf(element)] = element.data;



    // });
    // console.log(responses);

    // console.log(toObject(countries, responses));

    res.render("table", {
      appName: "My COVID-19 Tracker",
      pageName: "COVID-19 Cases",
      data: final,
    });

  }))
  .catch(error => {
    console.log(error);
  });
});

// About page
router.get('/about', function (req, res) {
  res.render('about');
  // res.send('This app show some basic infos and statistics about COVID19 pandemic. Source: TODO, <a href="/"> Go to the home page</a>');

})

function toObject(countries, responses) {
  let returnObject = {};

  for (var i = 0; i < countries.length; i++) {
    returnObject[countries[i]] = responses[i];
  }


  return returnObject;
}

//request:
// localhost:3000/byCountryLive/2020-05-08T00:00:00Z/2020-05-09T00:00:00Z/Poland/Germany/France

module.exports = router;
