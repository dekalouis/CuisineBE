// require("dotenv").config();
console.log({ env: process.env.NODE_ENV });
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env);
const express = require("express");

const app = express();
const routes = require("./routers");
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

// app.get("/", (req, res) => {
//   res.send("App sukses dijalankan");
// });

//commented while testing
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

module.exports = app;
