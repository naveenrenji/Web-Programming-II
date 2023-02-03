const helpers = require('../helpers');
const mongo = require('mongodb');
const bcrypt = require('bcryptjs');

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const createNewUser = async (name, username, password) => {
    if (!name || !username || !password) {
        throw "All details must be supplied to create a new user.";
    }
    name = helpers.checkName(name);
    username = helpers.checkUsername(username);
    helpers.checkPassword(password);
    const hashedPW = await bcrypt.hash(password, 10);
    const newUser = {
        _id: new mongo.ObjectId(),
        name: name,
        username: username,
        password: hashedPW
    }
    const usersCollection = await users();
    const user = await usersCollection.findOne({ username: username });
    if(!(user===null)) {
        throw 'Username already exists'
    }
    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not add new user.";
    return {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username
    }
}


const loginUser = async (username, password) => {
    username=helpers.checkUsername(username);
    helpers.checkPassword(password);
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user === null) throw 'Either the username or password is invalid';
    let realPassword = user.password;
    let compareToMatch = await bcrypt.compare(password, realPassword);

    if (compareToMatch) {
        return { '_id': user._id,'name':user.name, 'username': user.username };
    }
    else {
        throw 'Either the username or password is invalid';
    }
};


module.exports = {
    createNewUser,
    loginUser
}