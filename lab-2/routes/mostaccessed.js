const helpers = require('../helpers');
const express = require('express');
const router = express.Router();
const data = require('../data');
const recipesData = data.recipes;
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => { });

router
    .route('/')
    .get(async (req, res) => {
        try {
            let recipeItems = [];
            let top10 = await client.zRange('recipe-access-count', 0, 9, { REV: true });
            if (top10.length) {
                for (let i = 0; i < top10.length; i++) {
                    let recipe = await client.get(top10[i]);
                    recipeItems.push(JSON.parse(recipe));
                }
            }
            else {
                throw "No recipe was accessed yet";
            }
            return res.status(200).json(recipeItems);
        }
        catch (e) {
            if (e = "No recipe was accessed yet") {
                return res.status(404).json({ error: e });
            }
            return res.status(500).json({ error: e.message, e });
        }
    });

module.exports = router;