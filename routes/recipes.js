const express = require('express');
const router = express.Router();
const fs = require('fs');
const data = require('../data.json');
const recipes = data.recipes;

router.get('/', (req, res, next) => {
  // Map the recipe names to recipeNames
  const recipeNames = recipes.map((r) => r.name);

  // Return the list of names in JSON format under recipeNames
  return res.status(200).json({ recipeNames });
});

router.get('/details/:name', (req, res, next) => {
  // Look up recipe with given name
  // Return 200 if not found
  const recipe = recipes.find((r) => r.name === req.params.name);
  if (!recipe) return res.status(200).json({});

  let returnValue = {};
  returnValue['ingredients'] = recipe.ingredients;
  returnValue['numSteps'] = recipe.instructions.length;
  res.json({ details: returnValue });
});

router.post('/', (req, res, next) => {
  // Recipe object
  const recipe = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
  };

  // Look for an existing recipe with the same name and return 400 if found
  const recipeExists = recipes.find((r) => r.name === recipe.name);
  if (recipeExists) return res.status(400).json({ error: 'Recipe already exists' });

  // Push the new recipe to the recipes object
  recipes.push(recipe);

  // Rewrite the JSON file with the recipes object as an object under recipes key
  writeRecipeToJson(recipes);

  res.status(201).json();
});

router.put('/', (req, res, next) => {
  const name = req.body.name;
  const recipe = req.body;

  const recipeKey = getRecipeKeyByName(recipes, name);
  if (!recipeKey) return res.status(404).json({ error: 'Recipe does not exist' });
  recipes[recipeKey] = recipe;

  writeRecipeToJson(recipes);

  res.status(204).json();
});

function getRecipeKeyByName(recipes, name) {
  return Object.keys(recipes).find((key) => recipes[key].name === name);
}

function writeRecipeToJson(recipes) {
  fs.writeFile('./data.json', JSON.stringify({ recipes: recipes }, null, 2), function (err) {
    if (err) throw err;
    console.log('Writing to data.json');
  });
}
module.exports = router;
