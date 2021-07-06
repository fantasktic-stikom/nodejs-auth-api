require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");

const app = express()

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// include router
const mainRoute = require('./router')
app.use(mainRoute)

// listening on port 8000
app.listen(process.env.PORT)