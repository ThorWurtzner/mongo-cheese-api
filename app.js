require("dotenv").config();

const express = require("express");
const app = express();
const formidable = require("express-formidable");
var cors = require("cors");

require("./database.js");
app.use(cors());
app.use(formidable());
require("./cheeses.route.js")(app);

app.listen(process.env.PORT || 3000, function() {
    console.log("App is running on port " + process.env.PORT || 3000);
});