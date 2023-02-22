const helpers = require('../helpers');
const mongo = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => { });

const createRecipe = async (
  _id,
  username,
  title,
  ingredients,
  cookingSkillRequired,
  steps
) => {

  title = helpers.checkTitle(title);
  ingredients = helpers.checkIngredients(ingredients);
  cookingSkillRequired = helpers.checkCookingSkillRequired(cookingSkillRequired);
  steps = helpers.checkSteps(steps);

  let newRecipe = {
    title,
    ingredients,
    cookingSkillRequired,
    steps
  };

  newRecipe._id = new mongo.ObjectId()
  newRecipe.userThatPosted = { _id: mongo.ObjectId(_id), username: username }
  newRecipe.comments = [];
  newRecipe.likes = [];

  const recipecollection = await recipes();

  const insertInfo = await recipecollection.insertOne(newRecipe);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add new Recipe';

  const newId = insertInfo.insertedId.toString();

  const recipe = await getRecipeById(newId);
  recipe._id = newId;
  return recipe;
};

const getAllRecipes = async (page) => {
  recipeItems = [];
  if (!page) {
    page = 1;
  }
  page = parseInt(page);
  let limit = 50;
  let skip = (page - 1) * limit;
  const recipeCollection = await recipes();
  const recipeList = await recipeCollection.find().skip(skip).limit(limit).toArray();
  if (!recipeList) throw 'Could not get all Recipes';
  if (recipeList.length == 0) {
    if (page > 1) throw 'No more recipes for the requested page';
    return [];
  }
  recipeList.forEach((element) => {
    element._id = element._id.toString()
  });
  recipeList.forEach((recipeItem) => {
    recipeItems.push({
      _id: recipeItem._id,
      title: recipeItem.title,
      ingredients: recipeItem.ingredients,
      steps: recipeItem.steps,
      cookingSkillRequired: recipeItem.cookingSkillRequired
    })
  });
  let pageNumbersExists = await client.exists('pageNumbers');
  let pageNumbers;
  if(pageNumbersExists===0){
    pageNumbers=[];
  }
  else{
    pageNumbers = await client.get('pageNumbers');
    pageNumbers = JSON.parse(pageNumbers);
  }
  if(!(pageNumbers.includes(page))){
    pageNumbers.push(page);
    await client.set('pageNumbers',JSON.stringify(pageNumbers));
  }
  await client.set(`page-${page}`, JSON.stringify(recipeItems));
  return recipeItems;
};

const getRecipeById = async (recipeId) => {
  id = helpers.checkId(recipeId);
  const recipeCollection = await recipes();
  const recipe = await recipeCollection.findOne({ _id: mongo.ObjectId(id) });
  if (recipe === null) throw 'No recipe with that id';
  recipe._id = id;
  return recipe;
};


const updateRecipe = async (userThatPostedId, recipeId, updateRecipe) => {
  userThatPostedId = helpers.checkId(userThatPostedId);
  recipeId = helpers.checkId(recipeId);
  if (!("title" in updateRecipe) && !("ingredients" in updateRecipe) && !("cookingSkillRequired" in updateRecipe) && !("steps" in updateRecipe)) {
    throw "Invalid input. At least one of the following fields must be present: title, ingredients, cookingSkillRequired, steps.";
  }
  if (updateRecipe.hasOwnProperty("title")) {
    updateRecipe.title = helpers.checkTitle(updateRecipe.title);
  }
  if (updateRecipe.hasOwnProperty("ingredients")) {
    updateRecipe.ingredients = helpers.checkIngredients(updateRecipe.ingredients);
  }
  if (updateRecipe.hasOwnProperty("cookingSkillRequired")) {
    updateRecipe.cookingSkillRequired = helpers.checkCookingSkillRequired(updateRecipe.cookingSkillRequired);
  }
  if (updateRecipe.hasOwnProperty("steps")) {
    updateRecipe.steps = helpers.checkSteps(updateRecipe.steps);
  }

  const recipeCollection = await recipes();
  let oldRecipe;
  try {
    oldRecipe = await getRecipeById(recipeId);
  }
  catch (e) {
    throw e;
  }
  if (oldRecipe.userThatPosted._id.toString() !== userThatPostedId.toString()) {
    throw 'Unauthorised user cannot make changes';
  }
  if (updateRecipe.comments) {
    throw 'Cannot update comments';
  }
  else if (updateRecipe.likes) {
    throw 'Cannot update likes';
  }
  else if (updateRecipe.userThatPosted) {
    throw 'Cannot update userThatPosted';
  }
  let updatedRecipe = {};
  // let flag = false;
  // if(updateRecipe.title!=oldRecipe.title||updateRecipe.ingredients!=oldRecipe.ingredients||updateRecipe.steps!=oldRecipe.steps||updatedRecipe.cookingSkillRequired!=oldRecipe.cookingSkillRequired){
  //   flag=true;
  // }
  // if(flag){
  updatedRecipe.title = updateRecipe.title ? updateRecipe.title : oldRecipe.title;
  updatedRecipe.ingredients = updateRecipe.ingredients ? updateRecipe.ingredients : oldRecipe.ingredients;
  updatedRecipe.cookingSkillRequired = updateRecipe.cookingSkillRequired ? updateRecipe.cookingSkillRequired : oldRecipe.cookingSkillRequired;
  updatedRecipe.steps = updateRecipe.steps ? updateRecipe.steps : oldRecipe.steps;
  const updatedInfo = await recipeCollection.updateOne({ _id: mongo.ObjectId(id) }, { $set: updatedRecipe });
  if (updatedInfo.modifiedCount === 0) {
    throw "No changes were made";
  }
  return await getRecipeById(id);
  //   }
  // else{
  //   throw 'No changes were made';
  // }
}

const addCommentToRecipe = async (userId, username, recipeId, comment) => {
  recipeId = helpers.checkId(recipeId);
  userId = helpers.checkId(userId);

  let recipe = await getRecipeById(recipeId);
  if (!recipe) {
    throw 'no recipe with that id';
  }
  const recipeCollection = await recipes();
  let updatedInfo = await recipeCollection.updateOne({
    "_id": mongo.ObjectId(recipeId)
  },
    {
      "$push": {
        "comments": {
          "_id": new mongo.ObjectId(),
          "userThatPostedComment": {
            "_id": mongo.ObjectId(userId),
            "username": username
          },
          "comment": comment
        }
      }
    })
  if (!updatedInfo.acknowledged || !updatedInfo.modifiedCount) {
    throw "could not update recipe successfully";
  }
  return await getRecipeById(id);
}

const deleteRecipe = async (recipeId, commentId, userId) => {
  recipeId = helpers.checkId(recipeId);
  commentId = helpers.checkId(commentId);
  userId = helpers.checkId(userId);
  let comment = await getComment(commentId);
  if (!comment) {
    throw 'Could not find it, check recipeID and commentID'
  }
  let userThatCommentedId = comment.userThatPostedComment._id;
  if (userThatCommentedId.toString() !== userId) {
    throw 'Only the User who commented is allowed to delete this comment'
  }
  const recipeCollection = await recipes()
  let insertInfo = await recipeCollection.updateOne({
    "_id": mongo.ObjectId(recipeId),
  },
    {
      "$pull": {
        "comments": {
          "_id": mongo.ObjectId(commentId)
        }
      }
    });
  if (insertInfo.matchedCount == 1) {
    if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
      throw 'Could not remove comment from recipe';
  }
  else {
    throw 'Could not find it, check recipeID and commentID'
  }
  return getRecipeById(recipeId);
}

const getEveryRecipe = async () => {
  const recipeCollection = await recipes();
  const recipeList = await recipeCollection.find({}).toArray();
  if (!recipeList) throw 'Could not get all recipes';
  if (recipeList.length == 0) return [];
  recipeList.forEach((element) => {
    element._id = element._id.toString()
  })
  return recipeList;
};

const getComment = async (commentId) => {
  commentId = helpers.checkId(commentId);
  let comment;
  let recipesArray = await getEveryRecipe();
  recipesArray.forEach(element => {
    element.comments.forEach(commentel => {
      if (commentel._id.toString() == commentId)
        comment = commentel;
    })
  });
  return comment;
};

const likeRecipe = async (recipeId, userId) => {
  recipeId = helpers.checkId(recipeId);
  userId = helpers.checkId(userId);
  recipe = await getRecipeById(recipeId);
  if (!recipe) {
    throw 'No recipe with that id';
  }
  let likeExists = false;
  recipe.likes.forEach(likeId => {
    if (userId === likeId.toString()) {
      likeExists = true;
    }
  })
  if (likeExists) {
    const recipeCollection = await recipes()
    let insertInfo = await recipeCollection.updateOne({
      "_id": mongo.ObjectId(recipeId),
    },
      {
        "$pull": {
          "likes": mongo.ObjectId(userId)
        }
      });
    if (insertInfo.matchedCount == 1) {
      if (!insertInfo.acknowledged || !insertInfo.modifiedCount)
        throw 'Could not remove like from recipe';
    }
    else {
      throw 'No recipe with that id'
    }
    return await getRecipeById(recipeId);
  }
  else {
    const recipeCollection = await recipes();
    let updatedInfo = await recipeCollection.updateOne({
      "_id": mongo.ObjectId(recipeId)
    },
      {
        "$push": {
          "likes": mongo.ObjectId(userId)
        }
      })
    if (!updatedInfo.acknowledged || !updatedInfo.modifiedCount) {
      throw "could not update recipe successfully";
    }
    return await getRecipeById(id);
  }
}

module.exports = {
  createRecipe,
  getRecipeById,
  updateRecipe,
  addCommentToRecipe,
  getAllRecipes,
  deleteRecipe,
  likeRecipe
};
