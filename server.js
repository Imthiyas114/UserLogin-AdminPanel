require('dotenv').config(); // Ensure this is at the top

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const nocache = require('nocache');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const adminController = require('./controllers/adminController'); // Import adminController
const userRoute = require('./routes/user'); 

const app = express();




mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Set up view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache());

// Authentication middleware
function ensureAuthenticated(req, res, next) {
    if (req.session.user || req.session.admin) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Import routes
const adminRoute = require('./routes/admin');
const signupRoute = require('./routes/signup');

app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/signup', signupRoute);


app.get('/', (req, res) => {
    if (req.session.admin) {
        return res.redirect('/adminHome');
    } else if (req.session.user) {
        return res.redirect('/userHome');
    }
    res.render('login', { msg: '', msg1: '' });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!password) {
        return res.render('login', { msg1: "Sorry, not allowed" });
    }

    try {
        const foundUser = await User.findOne({ username });

        if (foundUser) {
            const match = await bcrypt.compare(password, foundUser.password);

            if (match) {
                req.session.user = username; // Set session
                return res.redirect('/user/userHome');
            }
        }

        res.render('login', { msg1: "Incorrect username or password" });

    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/adminHome', ensureAuthenticated, adminController.getAdminHome);

// User home route
app.get('/userHome', ensureAuthenticated, (req, res) => {
    res.render('userHome');
});

// SignUp route
app.get('/signUp', (req, res) => {
    res.render('signup');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// User details route
app.get('/admineHome', ensureAuthenticated, async (req, res) => {
    try {
        const users = await User.find();
        res.render('admineHome', { users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/search', async (req, res) => {
    const fullname = req.query.fullname


    try {
        // Search for a user with a full name that matches the search string (case-insensitive)
        const user = await User.findOne({ fullName: { $regex: new RegExp(fullname) } });

        if (user) {
            // Render the user details if the user is found
            res.render('userDetails', { user: user });
        } else {
            // Render a message if the user is not found
            const message = 'User not found';
            res.render('userDetails', { found: message });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for user');
    }
    
    if (!fullname) {
       
        const message = 'Please enter a name to search.';
        return res.render('adminHome', { message: message });
    }
});

app.get('/saveChange', async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await User.findById(userId);

        if (user) {
            // Assume updates are made here
            res.redirect('/adminHome');
        } else {
            res.render('userDetails', { found: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving user data');
    }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
