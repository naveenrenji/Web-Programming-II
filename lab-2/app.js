const express = require('express');
const app = express();
const configRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(express.json());

const redis = require('redis');
//Configure redis client
const redisClient = redis.createClient();
redisClient.connect().then(() => { });

// const connectRedis = require('connect-redis');
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//const RedisStore = connectRedis(session)

// //Configure session middleware
// app.use(session({
//     store: new RedisStore({ client: redisClient }),
//     secret: 'secret$%^134',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // if true only transmit cookie over https
//         httpOnly: false, // if true prevent client side JS from reading the cookie 
//         maxAge: 1000 * 60 * 10 // session max age in miliseconds
//     }
// }))

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
  // if(req.session.username){
  //   next();
  // }
  if (req.session.username === undefined) {
    let sessionExists = await redisClient.exists('session');
    if (sessionExists) {
      let sessionUser = await redisClient.get('session');
      sessionUser = JSON.parse(sessionUser);
      req.session.username = sessionUser.username;
      req.session._id = sessionUser._id;
    }
  }
  next();

})

app.use(async (req, res, next) => {
  const { url, method, body } = req;
  let exists = await redisClient.exists('naveens_girlfriend');
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

app.use('/recipes', async (req, res, next) => {
  if (req.method === "GET") {
    let page = req.query.page;
    let pageExists = await redisClient.exists(`page-${page}`);
    if (pageExists) {
      let recipeList = await redisClient.get(`page-${page}`);
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
    let recipeExists = await redisClient.exists(id);
    if (recipeExists) {
      let recipe = await redisClient.get(id);
      let a = await redisClient.zIncrBy('recipe-access-count', 1, id);
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