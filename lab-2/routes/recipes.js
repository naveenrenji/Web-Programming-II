const helpers = require('../helpers');
const express = require('express');
const router = express.Router();
const data = require('../data');
const recipesData = data.recipes;
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => { });

const delPages = async () => {
    let pageNumbersExists = await client.exists('pageNumbers');
    let pageNumbers;
    if (pageNumbersExists === 0) {
        return;
    }
    else {
        pageNumbers = await client.get('pageNumbers');
        pageNumbers = JSON.parse(pageNumbers);
    }
    for (let i = 0; i < pageNumbers.length; i++) {
        await client.del(`page-${pageNumbers[i]}`);
    }
    await client.del('pageNumbers');
};

router
    .route('/')
    .get(async (req, res) => {
        //code here for GET
        try {
            let page = req.query.page;
            if (page !== '') {
                if (page <= 0) {
                    throw 'negative page number or zero page number not allowed';
                }
            }
            if (!page) {
                page = 1;
            }
            const recipeItems = await recipesData.getAllRecipes(page);
            if (recipeItems.length == 0) return res.status(404).json({ error: 'No more recipes for the requested page' });
            res.status(200).json(recipeItems);
        } catch (e) {
            if (e === 'negative page number or zero page number not allowed') {
                return res.status(400).json({ error: e.message, e });
            }
            else if (e === 'No more recipes for the requested page') {
                return res.status(404).json({ error: 'No more recipes for the requested page' });
            }
            else
                return res.status(500).json({ error: e.message, e });
        }
    })
    .post(async (req, res) => {
        //code here for POST
        if (req.session.username) {
            const recipeData = req.body;
            try {
                let { title, ingredients, steps, cookingSkillRequired } = recipeData;
                title = helpers.checkTitle(title);
                ingredients = helpers.checkIngredients(ingredients);
                cookingSkillRequired = helpers.checkCookingSkillRequired(cookingSkillRequired);
                steps = helpers.checkSteps(steps);
                const newRecipe = await recipesData.createRecipe(req.session._id, req.session.username, title, ingredients, cookingSkillRequired, steps);
                await client.set(newRecipe._id.toString(), JSON.stringify(newRecipe));
                await delPages();
                let a = await client.zIncrBy('recipe-access-count', 1, newRecipe._id.toString());
                return res.status(200).json(newRecipe);
            } catch (e) {
                return res.status(400).json({ error: e.message, e });
            }
        }
        else {
            return res.status(403).json({ error: 'User not logged in, hence unauthorised to post a recipe' });
        }
    });

router.route('/:id/likes')
    .post(async (req, res) => {
        if (req.session.username) {
            try {
                const id = helpers.checkId(req.params.id, 'recipeID');
                const updatedRecipeInfo = await recipesData.likeRecipe(id, req.session._id);
                let recipeExists = await client.exists(updatedRecipeInfo._id.toString());
                if (recipeExists) {
                    await client.set(updatedRecipeInfo._id.toString(), JSON.stringify(updatedRecipeInfo));
                    await delPages();
                    let a = await client.zIncrBy('recipe-access-count', 1, updatedRecipeInfo._id.toString());
                }
                return res.status(200).json(updatedRecipeInfo);
            }
            catch (e) {
                if (e === 'Error: recipeID invalid object ID') {
                    return res.status(400).json({ error: e });
                }
                if (e === 'No recipe with that id') {
                    return res.status(404).json({ error: e });
                }
                else {
                    return res.status(500).json({ error: e });
                }
            }
        }
        else {
            return res.status(403).json({ error: 'User not logged in, hence unauthorised' });
        }
    });

router.route('/:id/comments')
    .post(async (req, res) => {
        if (req.session.username) {
            try {
                const comment = req.body.comment;
                if (!comment) {
                    return res.status(400).json({ error: 'Please input as a JSON with the field key as comment only' });
                }
                const id = req.params.id;
                const updatedRecipeInfo = await recipesData.addCommentToRecipe(req.session._id, req.session.username, id, comment);
                let recipeExists = await client.exists(updatedRecipeInfo._id.toString());
                if (recipeExists) {
                    await client.set(updatedRecipeInfo._id.toString(), JSON.stringify(updatedRecipeInfo));
                    await delPages();
                    let a = await client.zIncrBy('recipe-access-count', 1, updatedRecipeInfo._id.toString());
                }
                return res.status(200).json(updatedRecipeInfo);
            }
            catch (e) {
                return res.status(500).json({ error: e });
            }
        }
        else {
            return res.status(403).json({ error: 'User not logged in, hence unauthorised' });
        }
    })

router.route('/:recipeId/:commentId')
    .delete(async (req, res) => {
        if (req.session.username) {
            try {
                const recipeId = req.params.recipeId;
                const commentId = req.params.commentId;
                let updatedRecipeInfo;
                try {
                    updatedRecipeInfo = await recipesData.deleteRecipe(recipeId, commentId, req.session._id);
                    let recipeExists = await client.exists(updatedRecipeInfo._id.toString());
                    if (recipeExists) {
                        await client.set(updatedRecipeInfo._id.toString(), JSON.stringify(updatedRecipeInfo));
                        await delPages();
                        let a = await client.zIncrBy('recipe-access-count', 1, updatedRecipeInfo._id.toString());
                    }
                }
                catch (e) {
                    if (e === 'Could not find it, check recipeID and commentID') {
                        return res.status(404).json({ error: e });
                    }
                    else if (e === 'Only the User who commented is allowed to delete this comment') {
                        return res.status(403).json({ error: 'Only the User who commented is allowed to delete this comment' });
                    }
                    return res.status(500).json({ error: e });
                }
                return res.status(200).json(updatedRecipeInfo);
            }
            catch (e) {
                return res.status(500).json({ error: e });
            }
        }
        else {
            return res.status(403).json({ error: 'User not logged in, hence unauthorised' });
        }
    })

router.route('/:id')
    .get(async (req, res) => {
        try {
            req.params.id = helpers.checkId(req.params.id, 'Id URL Param');
        } catch (e) {
            return res.status(400).json({ error: e.message, e });
        }
        try {
            const recipe = await recipesData.getRecipeById(req.params.id);
            await client.set(req.params.id.toString(), JSON.stringify(recipe));
            let a = await client.zIncrBy('recipe-access-count', 1, recipe._id.toString());
            res.status(200).json(recipe);
        } catch (e) {
            res.status(404).json({ error: e.message, e });
        }
    })
    .patch(async (req, res) => {
        try {
            if (req.session.username) {
                const updatedRecipe = req.body;
                const id = req.params.id;
                const updatedRecipeInfo = await recipesData.updateRecipe(req.session._id, id, updatedRecipe);
                let recipeExists = await client.exists(updatedRecipeInfo._id.toString());
                if (recipeExists) {
                    await client.set(updatedRecipeInfo._id.toString(), JSON.stringify(updatedRecipeInfo));
                    await delPages();
                    let a = await client.zIncrBy('recipe-access-count', 1, updatedRecipeInfo._id.toString());
                }
                res.status(200).json(updatedRecipeInfo);
            }
            else {
                return res.status(403).json({ error: 'User not logged in, hence unauthorised' });
            }
        } catch (e) {
            if (e === 'Unauthorised user cannot make changes') {
                return res.status(403).json({ error: e });
            }
            else if (e === 'No changes were made') {
                return res.status(400).json({ error: e });
            }
            else if (e === 'No recipe with that id') {
                return res.status(400).json({ error: e });
            }
            else if (e.toString().includes('You must provide valid')) {
                return res.status(400).json({ error: e });
            }
            else if (e.toString().includes('Cannot update')) {
                return res.status(400).json({ error: e });
            }
            else {
                return res.status(500).json({ error: e });
            }
        }
    })



module.exports = router;