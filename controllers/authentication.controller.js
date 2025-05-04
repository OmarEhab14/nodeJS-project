const bcrypt = require("bcrypt");
const Users = require("../models/user.model");

const register = async (req, res) => {
    // console.log(req.body)
    const { username, email, password, isAdmin } = req.body;

    console.log(username);
    console.log(email);
    // console.log(password)

    if (!username || !email || !password) {
        return res.status(400).json({
            status: "failure",
            message: "missing required fields",
        });
    }

    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
        return res.status(400).json({
            status: "failure",
            message: "User already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
        username: username,
        email: email,
        password: hashedPassword,
        isAdmin: isAdmin
    });

    // console.log(hashedPassword)

    await newUser.save();
    req.session.user = newUser;
    console.log(req.session.user);
    res.redirect("/home");
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    const correctPassword = await bcrypt.compare(password, user.password);
    console.log(user.username);
    if (!user || !correctPassword) {
        res.status(400).json({
            status: "failure",
            message: "Invalid email or password",
        });
    }

    req.session.user = user;
    res.redirect("/home");
}

const logout = async (req, res) => {
    req.session.destroy();
    res.redirect("/login");
}

module.exports = {
    register,
    login,
    logout,
}