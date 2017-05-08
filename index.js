var express = require('express');
var fs = require("fs");
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Read Synchrously
var domains = fs.readFileSync("public/lists/domains.json");
var names = fs.readFileSync("public/lists/names.json");

// Define to JSON type
var jsonDomains = JSON.parse(domains);
var jsonNames = JSON.parse(names);

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Handles returning a unicorn email address
 */
function getUnicornEmail(jsonNames, jsonDomains){
  console.log('Total names: ' + jsonNames.results.length);
  console.log('Total domains: ' + jsonDomains.results.length);
  var rNameIndex = getRandomInt(0, jsonNames.results.length - 1);
  var rDomainIndex = getRandomInt(0, jsonDomains.results.length - 1);
  console.log('Using name index: ' + rNameIndex);
  console.log('Using domain index: ' + rDomainIndex);
  var email = jsonNames.results[rNameIndex].name + rNameIndex.toString() + rDomainIndex.toString() + '@' + jsonDomains.results[rDomainIndex].domain;
  console.log('Created the email address: ' + email);
  return email;
}

app.get('/', function(req, res) {
  // Default to 50 emails.
  var total = 50;
  res.json({
    results: 'Test',
    meta: {
      requestedAt: Date.now()
    }
  });
});

app.get('/:total/:format?', function(req, res) {
  var total = 50;
  var format = 'json';
  // Limit to 100 emails.
  if(parseInt(req.params.total) > 100){
    total = 100;
  } else {
    total = parseInt(req.params.total);
  }

  // Set the format
  switch(req.params.format) {
    case 'text':
    case 'txt':
      format = 'text';
      break;

    default:
      format = 'json';
      break;
  }
  console.log('Displaying results as ' + format);

  // This needs to be updated based on the format.
  var results = [];
  for(var i = 0; i< total; i++){
    var tEmail = getUnicornEmail(jsonNames, jsonDomains);
    results.push(tEmail);
  }
  console.log('Emails created:');
  console.log(results);
  if (format === 'text'){
    // var finalResults = results.toString().replace(/,/g, '\n\r');
    // console.log('Final text results: ' + finalResults);
    return res.render('pages/index', {
      results: results
    });
  }
  // Fallback to json
  res.json({
    results: {
      emails: results,
      meta: {
        total: total,
        format: format,
        requestedAt: Date.now()
      }
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
