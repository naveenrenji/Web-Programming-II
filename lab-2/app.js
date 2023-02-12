const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => { });

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

app.use(async (req, res, next) => {
  const { url, method, body } = req;
  let exists = await client.exists('naveens_girlfriend');
  if (exists) {
    console.log('It is a miracle');
  }
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

app.use('/recipes', async(req, res, next) => {
  if(req.method === "GET" ){
    let page = req.query.page;
    let pageExists = await client.exists(`page-${page}`);
    if(pageExists){
      let recipeList = await client.get(`page-${page}`);
      return res.status(200).json(JSON.parse(recipeList));
    }
  }
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

app.use('/recipes/:recipeId', async (req, res, next) => {
  if (req.method === 'GET') {
    let id = req.params.recipeId;
    id = id.toString();
    let recipeExists = await client.exists(id);
    if (recipeExists) {
      let recipe = await client.get(id);
      let a = await client.zIncrBy('recipe-access-count', 1, id);
      return res.status(200).json(JSON.parse(recipe));
    }
    else {
      next();
    }
  }
  else {
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