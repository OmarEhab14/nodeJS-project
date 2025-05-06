const bcrypt = require("bcrypt");
const Users = require("../models/user.model");

const register = async (req, res) => {
    const {
        firstName,
        lastName,
        mobile,
        gender,
        username,
        email,
        password,
        confirmPassword,
        isAdmin,
    } = req.body;

    if (!firstName || !lastName || !mobile || !gender || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({
            status: "failure",
            message: "Missing required fields",
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            status: "failure",
            message: "Passwords do not match",
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
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        gender: gender,
        username: username,
        email: email,
        password: hashedPassword,
        isAdmin: isAdmin || false
    });

    await newUser.save();
    req.session.user = newUser;
    res.redirect("/home");
};


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