const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());


//middlewares
app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    //cookie: {maxAge: 60000}
  })
);

app.use((req, res, next) => {
  const { url, method, body } = req;
  let requestBody = { ...body };
  let pwd;
  if (requestBody.password) {
    pwd = requestBody.password;
    requestBody.password = "*****";
  }
  console.log(`URL: ${url} | Method: ${method} | Request Body:`, requestBody);
  requestBody.password = pwd
  next();
});

let urlCount = {};
app.use((req, res, next) => {
  if (urlCount[req.path]) {
    urlCount[req.path]++;
  } else {
    urlCount[req.path] = 1;
  }
  console.log(urlCount);
  next();
});

app.use('/recipes', (req, res, next) => {
  if (!req.session.username && (req.method === "POST" || req.method === "PUT" || req.method === "PATCH")) {
    return res.status(403).json({
      error: "You must be logged in to access this route."
    });
  } else {
    next();
  }
});


app.use('/recipes/:id/comments', (req, res, next) => {
  if (!req.session.username && (req.method === "POST")) {
    return res.status(403).json({
      error: "You must be logged in to access this route."
    });
  } else {
    next();
  }
});

app.use('/recipes/:recipeId/:commentId', (req, res, next) => {
  if (!req.session.username && (req.method === "DELETE")) {
    return res.status(403).json({
      error: "You must be logged in to access this route."
    });
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

// const recipes = require('./data/recipes');
// const users = require('./data/users');
// const connection = require('./config/mongoConnection');

// const main = async ()=> {
// try{
//     await connection.dbConnection();
//     let a= await users.loginUser('nrenji1','Naveen@123');

//     // let a= await recipes.addCommentToRecipe('63d222099ad17c20d4e616cb','hahaha boo');
//     //let a = await recipes.getRecipeById('63d2177d6dc9b3a91cf29223');
//     //let a = await recipes.createRecipe("Fried Chicken", ["One whole chicken", "2 cups of flour", "2 eggs", "salt", "pepper", "1 cup cooking oil"], "Novice", ["First take the two eggs and mix them with the flour, the salt and the pepper", "Next, dip the chicken into the mix", "take 1 cup of oil and put in frier", "Fry the chicken on medium heat for 1 hour","serve and eat happily"]);
//     console.log(a);
// }
// catch(e){
//     console.log(e);
// }
// }

// main()