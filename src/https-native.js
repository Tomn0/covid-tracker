const https = require("https");
const url = "https://api.covid19api.com/country/poland/status/confirmed/live?from=2020-05-06T00:00:00Z&to=2020-05-12T00:00:00Z";

https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(body);
  });
});