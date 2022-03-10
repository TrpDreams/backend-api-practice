const express = require("express");
const app = express();
const recipes = require('./routes/recipes');

app.use(express.json());
app.use('/recipes', recipes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${ port }...`);
});

