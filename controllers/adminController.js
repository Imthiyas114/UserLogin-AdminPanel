// adminController.js
const User = require('../models/user');
const admins = [
    { username: 'Rohan', password: '11410' },
    { username: 'Roshan', password: '11411' }
];


exports.adminHome = async (req, res) => {
    try {
        const users = await User.find(); // Fetch user data as needed
        res.render('adminHome', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
};



exports.verifyAdmin = (req, res) => {
    const { username, password } = req.body;

    if (!password) {
        res.render('login', { msg1: "Sorry, not allowed" });
        return;
    }

    const foundAdmin = admins.find(admin => admin.username === username && admin.password === password);

    if (foundAdmin) {
        req.session.admin = username;
        console.log('Admin session set:', req.session.admin); // Debug line
        res.redirect('/adminHome');
    } else {
        req.session.passwordwrong = true;
        res.redirect('/');
    }
};


exports.getAdminHome = async (req, res) => {
    try {
        // Fetch users and select only the needed fields: fullName, batch, and phone
        const users = await User.find({}, 'fullName batch phone username');
        const name = req.session.admin;
        res.render('adminHome', { users, name });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
};