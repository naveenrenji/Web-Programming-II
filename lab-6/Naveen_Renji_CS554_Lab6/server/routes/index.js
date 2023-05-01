const marvelCharacters = require("./marvelCharacters");
const characters = require('./characters');


const constructorMethod = (app) => {
  app.use("/marvel-characters", marvelCharacters);
  app.use("/character", characters);

  app.use("*", (req, res) => {
    res.status(404).json({ error: " Not Found " });
  });
};

module.exports = constructorMethod;
