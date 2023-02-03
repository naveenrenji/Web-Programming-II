const helpers = require('../helpers');
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;


router
    .route('/signup')
    .post(async (req, res) => {
        //code here for POST
        if (req.session.username) {
            return res.status(400).json({ error: 'You need to logout before signing up for another account' });
        }
        else {
            let name = req.body.name;
            let username = req.body.username;
            let password = req.body.password;
            try {
                name = helpers.checkName(name);
                username = helpers.checkUsername(username);
                helpers.checkPassword(password);
            }
            catch (e) {
                return res.status(400).json({ error: e });
            }
            try {
                const a = await userData.createNewUser(name, username, password);
                if (a === null) throw 'Could not create user due to server error';
                else {
                    return res.status(200).json(a);
                }
            }
            catch (e) {
                if (e === 'Username already exists') {
                    return res.status(409).json({ error: e });
                }
                else return res.status(500).json({ error: e });
            }
        }
    })

router
    .route('/login')
    .post(async (req, res) => {
        //code here for POST
        if (req.session.username) {
            return res.status(400).json({ error: 'You need to logout before logging in to another account' });
        }
        else {
            let username = req.body.username;
            let password = req.body.password;
            try {
                username = helpers.checkUsername(username);
                helpers.checkPassword(password);
            }
            catch (e) {
                return res.status(400).json({ error: 'Incorrect username or password' });
            }
            try {
                const a = await userData.loginUser(username, password);
                if (!(a === null)) {
                    const now = new Date();
                    const expiresAt = new Date();
                    expiresAt.setHours(expiresAt.getHours() + 1);
                    req.session.username = a.username;
                    req.session._id = a._id;
                    res.cookie('AuthCookie', now.toString(), { expires: expiresAt });
                    // req.session.username = username;
                    return res.status(200).json(a);
                }
                else {
                    throw 'Internal Server Error';
                }
            }
            catch (e) {
                if (e === 'Either the username or password is invalid') {
                    return res.status(401).json({ error: e });
                }
                return res.status(500).json({ error: e });
            }
        }
    })

router
    .route('/logout')
    .get(async (req, res) => {
        try {
            if (req.session.username) {
                const anHourAgo = new Date();
                anHourAgo.setHours(anHourAgo.getHours() - 1);
                res.cookie('AuthCookie', '', { expires: anHourAgo });
                res.clearCookie('AuthCookie');
                res.status(200).json('User has been logged out');
            }
            else {
                res.status(400).json('error: Bad Request, user is not logged in to log out')
            }
        }
        catch (e) {
            res.status(500).json({ error: e });
        }
    })

module.exports = router;