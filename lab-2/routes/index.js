const recipes = require('./recipes');
const users = require('./users');
const mostaccessed = require('./mostaccessed');



const constructorMethod = (app) => {
  app.use('/recipes', recipes);
  app.use('/mostaccessed', mostaccessed);
  app.use('/', users);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;