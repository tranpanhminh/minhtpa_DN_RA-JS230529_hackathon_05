const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const querystring = require("querystring");
const app = express();
const port = process.env.PORT || 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());
// ADD THIS
var cors = require("cors");
app.use(cors());

//   ------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
