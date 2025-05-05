const Users = require('../models/user.model')

const getUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getUserById = async (req, res) => {
    try {
        var id = req.params.id
        const user = await Users.findById(id)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createUser = async (req, res) => {
    try {
        const newUser = new Users({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
            isTest: req.body.isTest,
        });
        await newUser.save()
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password, isAdmin } = req.body;
        const updateFields = {};

        // Not to overwrite the contents of the fields in the database
        // if (req.body.username) updateFields.username = req.body.username;
        // if (req.body.email) updateFields.email = req.body.email;
        // if (req.body.password) updateFields.password = req.body.password;
        // if (typeof req.body.isAdmin === "boolean") updateFields.isAdmin = req.body.isAdmin;
        if (username !== undefined) {
            updateFields.username = username;
        }
        if (email !== undefined) {
            updateFields.email = email;
        }
        if (password !== undefined) {
            updateFields.password = password;
        }
        if (typeof isAdmin === 'boolean') {
            updateFields.isAdmin = isAdmin;
        }
        const user = await Users.findByIdAndUpdate({ _id: userId }, { $set: updateFields }, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await Users.deleteOne({ _id: userId })
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};