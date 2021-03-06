const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");

// Necessary code indicating that there is a static folder named 'public' to be accessed
app.use(express.static("public"));
// body-parser is responsible for parsing incoming request bodies in the middleware before handling
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("server is running on port " + process.env.PORT);
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  var data = {
    'members': [{
      'email_address': email,
      'status': "subscribed",
      'merge_fields': {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  var jsonData = JSON.stringify(data);

  const url = "" //Audience list here

  const options = {
    method: "POST",
    auth: "" //Insert API KEY HERE
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  app.post("/failure.html", function(req, res){
    res.redirect("/");
  });

  request.write(jsonData);
  request.end();

});

