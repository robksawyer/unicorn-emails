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

app.get('/:total/?:format', function(req, res) {
  var total = 50;
  var format = 'json';
  // Limit to 100 emails.
  if(parseInt(req.params.total) > 100){
    total = 100;
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
  res.json({
    results: {
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
