const express = require('express')
const router = express.Router()
const users = require('../../users.js');
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const updateFields = {};

    // Not to overwrite the contents of the fields in the database
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) updateFields.password = req.body.password;
    if (typeof req.body.isAdmin === "boolean") updateFields.isAdmin = req.body.isAdmin;

    try {
        const user = await users.updateOne({ _id: userId }, { $set: updateFields });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router