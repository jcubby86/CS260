const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const path = '/etc/data/public/';
app.use(express.static(path));
app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

app.listen(3000, () => console.log('Server listening on port 3000!'));

