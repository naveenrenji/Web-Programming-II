const express = require("express");
const app = express();
configRoutes = require("./routes");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = require("redis");
const redisClient = redis.createClient();
redisClient.connect().then(() => {
  console.log("Redis is connected");
});

// need to set up redis middleare to check for page and character details in cache
app.use('/marvel-characters/page/:pagenum', async (req, res, next) => {
  if (req.method === 'GET') {
    let page = req.params.pagenum;
    page = page.toString();
    let pageExists = await redisClient.exists(`page-${page}`);
    if (pageExists) {
      let pageInfo = await redisClient.get(`page-${page}`);
      return res.status(200).json(JSON.parse(pageInfo));
    }
    else {
      next();
    }
  }
  else {
    next();
  }
});

app.use('/character/:id', async (req, res, next) => {
  if (req.method === 'GET') {
    let id = req.params.id;
    id = id.toString();
    let characterExists = await redisClient.exists(`character-${id}`);
    if (characterExists) {
      let character = await redisClient.get(`character-${id}`);
      return res.status(200).json(JSON.parse(character));
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

app.listen(8000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:8000');
  })