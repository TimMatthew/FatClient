const User = require("../models/userModel.js");

class userDAO {

    static async createUser(userData) {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser;
        } catch (err) {
            throw new Error("Error creating user: " + err.message);
        }
    }

    static async getUserByLogin(login) {
        try {
            return await User.findOne({ login });
        } catch (err) {
            throw new Error("Error fetching user: " + err.message);
        }
    }
}

module.exports = userDAO;
