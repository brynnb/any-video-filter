//define fs module
var fs = require('fs');
//define PageProcessor module
const pageProcessor = require('./PageProcessor.js');

//load testdata/redditexample.html into a variable
var html = fs.readFileSync('testdata/example.html', 'utf8');

//call PageProcessor constructor with html
new pageProcessor(html);

