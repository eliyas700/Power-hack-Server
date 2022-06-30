/*
 *Backend for Power Hack
 *Author Eliyas Hossain
 */

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello! Power Hack Server is Running Smoothly");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
