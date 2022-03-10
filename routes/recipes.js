const express = require('express');
const router = express.Router();
const fs = require('fs');
const data = require('../data.json');
const recipes = data.recipes;

router.get("/", (req, res, next) => {
  // Map the recipe names to recipeNames
  const recipeNames = recipes.map(r => r.name)
  // const keys = Object.keys(data);
  // console.log(`Object contains ${ keys.length } keys | Keys: ${ keys }`);
  // console.log(data.recipes.find(r => r.name == "garlicPasta"));

  // Return the list of names in JSON format under recipeNames
  return res.status(200).json({ recipeNames });
});

// const data = fileToJson("./data.json");
// const keys = Object.keys(data);
// console.log(`Object contains ${ keys.length } keys | Keys: ${ keys }`);
// console.log(data.recipes.find(r => r.name == "garlicPasta"));

router.get("/details/:name", (req, res, next) => {
  // Look up recipe with given name
  // Return 404 if not found
  

  const recipe = recipes.find(r => r.name === req.params.name);
  if(!recipe) return res.status(200).json({});
  let returnValue = {};
  returnValue['ingredients'] = recipe.ingredients;
  returnValue['numSteps'] = recipe.instructions.length;
  res.json({ 'details': returnValue });
});

router.post("/", (req, res, next) => {
  const recipe = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
};
// Look for an existing recipe with the same name and return 400 if found
const recipeCheck = recipes.find(r => r.name === recipe.name);
if(recipeCheck) return res.status(400).json({ 'error': 'Recipe already exists'});

// Push the new recipe to the recipes object
recipes.push(recipe);

// Rewrite the JSON file with the recipes object as an object under recipes key
fs.writeFile('./data.json', JSON.stringify({ 'recipes': recipes }, null, 2), function(err)  {
  if(err) throw err;
  console.log('Writing to data.json');
});

res.status(201).json();
});

module.exports = router;