const mongo = require('mongodb');

const checkTitle = (title) => {
  //Validating Title
  if (!title) throw 'You must provide a Title';
  if (typeof title !== 'string') throw 'Name must be a string';
  if (title.trim().length === 0)
    throw 'Title cannot be an empty string or string with just spaces';
  title = title.trim();
  if (title.length < 2) throw 'Title must have atleast two letters'
  if (!(/^[a-z'()/:0-9A-Z\s]+$/.test(title))) throw 'Title cannot have special characters or punctuations except ones useful in a title';
  if (/^\d+$/.test(title)) {
    throw "Title cannot be all numbers"
  }
  return title;
};

const checkIngredients = (ingredients) => {
  //Validating Ingredients
  let ingredientInvalidFlag = false;
  if (!ingredients || !Array.isArray(ingredients))
    throw 'You must provide an array of ingredients';
  if (ingredients.length < 3) throw 'You must supply at least 3 ingredients';
  for (i = 0; i < ingredients.length; i++) {
    if (typeof (ingredients[i]) !== 'string' || ingredients[i].trim().length === 0 || ingredients[i].length < 3 || ingredients[i].length > 50 || !(/^[a-z0-9A-Z\s]+$/.test(ingredients[i]))) {
      ingredientInvalidFlag = true;
      break;
    }
    ingredients[i] = ingredients[i].trim();
  }
  if (ingredientInvalidFlag)
    throw 'One or more ingredients is not a valid ingredient or is an empty string';
  return ingredients;
};

const checkSteps = (steps) => {
  //Validating steps
  let stepsInvalidFlag = false;
  if (!steps || !Array.isArray(steps))
    throw 'You must provide an array of steps';
  if (steps.length < 5) throw 'You must supply at least 5 steps';
  for (i in steps) {
    if (typeof steps[i] !== 'string' || steps[i].trim().length === 0 || steps[i].length < 20 || !(/^[-(),.:""'/a-z0-9A-Z\s]+$/.test(steps[i]))) {
      stepsInvalidFlag = true;
      break;
    }
    steps[i] = steps[i].trim();
  }
  if (stepsInvalidFlag)
    throw 'One or more ingredients is not a valid ingredient or is an empty string';
  return steps;
};

const checkCookingSkillRequired = (cookingSkillRequired) => {
  //Validating cookingSkillRequired
  cookingSkillRequired=cookingSkillRequired.toLowerCase();
  if (!cookingSkillRequired) throw 'You must provide a cookingSkillRequired';
  if (typeof cookingSkillRequired !== 'string') throw 'cookingSkillRequired must be a string';
  if (cookingSkillRequired.trim().length === 0)
    throw 'cookingSkillRequired cannot be an empty string or string with just spaces';
  let skills = ['novice', 'intermediate', 'advanced'];
  cookingSkillRequired = cookingSkillRequired.trim();
  let res = skills.indexOf(cookingSkillRequired);
  if (res === -1) throw 'You must provide valid cookingSkillRequired';
  if(res===0) cookingSkillRequired='Novice';
  else if (res===1) cookingSkillRequired='Intermediate';
  else if (res===2) cookingSkillRequired='Advanced';
  return cookingSkillRequired;
};


const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== 'string') throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!mongo.ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

const checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
};

const checkUsername = (strVal) => {
  strVal=strVal.trim();
  strVal=strVal.toLowerCase();
  if (!/^[a-z0-9]+$/i.test(strVal) || strVal.length < 3) {
    throw "Username must be alphanumeric (alphabets or numbers only) and at least 3 characters long.";
  }
  if (/^\d+$/.test(strVal)) {
    throw "Username cannot be all numbers";
  }
  return strVal;
}


const checkPassword = (strVal) => {

  // check password length and complexity
  if (strVal.length < 6) {
    throw "strVal must be at least 6 characters long";
  }
  if (!/[a-z]/.test(strVal)) {
    throw `passwordmust contain at least one lowercase letter.`;
  }
  if (!/[A-Z]/.test(strVal)) {
    throw `password must contain at least one uppercase letter.`;
  }
  if (!/[0-9]/.test(strVal)) {
    throw `password must contain at least one number.`;
  }
  if (!/[!@#$%^&*]/.test(strVal)) {
    throw `password must contain at least one special character.`;
  }
}


const checkName = (strVal) => {
  if (!strVal) throw 'You must provide a name';
  if (typeof strVal !== 'string') throw 'name must be a string';
  if (strVal.trim().length === 0)
    throw 'name cannot be an empty string or string with just spaces';
  strVal = strVal.trim();
  let a = strVal.split(' ');
  if (a.length != 2) throw 'name must have first and last name only'
  a.forEach(element => {
    if (!(/^[a-zA-Z]+$/.test(element))) throw 'name must contain only alphabets'
    if (element.length < 3) throw 'name must have atleast 3 letters'
  });
  return strVal;
}

module.exports = {
  checkCookingSkillRequired,
  checkIngredients,
  checkSteps,
  checkTitle,
  checkPassword,
  checkUsername,
  checkName,
  checkId,
  checkString
};