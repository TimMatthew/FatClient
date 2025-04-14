const UserDAO = require("../DAO/userDAO.js");

class UserController {
    static async login(req, res) {
        try {
            const { login, password } = req.body; 

            
            const user = await UserDAO.getUserByLogin(login);
            const status = user.status

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            
            if (user.password !== password) {
                return res.status(400).json({ message: "Incorrect password" });
            }

            
            res.json({ message: "Login successful", userId: user._id, userStatus: status});

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = UserController;
