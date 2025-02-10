const express = require("express");
const CuisineController = require("./controllers/cuisineController");
const app = express();
// const routes = require("./routers");
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use("/", routes);

app.get("/", (req, res) => {
  res.send("App sukses dijalankan");
});

app.post("/cuisines", CuisineController.createCuisine);
app.get("/cuisines", CuisineController.getCuisine);
app.get("/cuisines/:id", CuisineController.getCuisineById);

app.put("/cuisines/:id", CuisineController.updateCuisineById);
app.delete("/cuisines/:id", CuisineController.deleteCuisineById);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
