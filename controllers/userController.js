



const bcrypt = require('bcrypt');
const User = require('../models/user');
const express = require('express');
const router = express.Router(); 

exports.verifyUser = async (req, res) => {
    const { username, password } = req.body;

    if (!password) {
        res.render('login', { msg1: "Sorry, not allowed" });
        return;
    }

    try {
        const foundUser = await User.findOne({ username });

        if (foundUser) {
            const match = await bcrypt.compare(password, foundUser.password);
            if (match) {
                req.session.user = username; 
                res.redirect('/userHome');  
            } else {
                res.render('login', { msg1: "Incorrect username or password" });
            }
        } else {
            res.render('login', { msg1: "Incorrect username or password" });
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getEditUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId); // Fetch user by ID
        res.render('editUser', { user }); // Render edit form with user data
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user');
    }
};

// In userController.js
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { fullName, batch, phone, username } = req.body;
    try {
        // Update user details
        await User.findByIdAndUpdate(userId, { fullName, batch, phone, username });

        // Redirect to admin home page (admineHome)
        res.redirect('/adminHome');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
};


exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId); // Delete user by ID
        res.redirect('/adminHome'); // Redirect to user details page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user');
    }
};