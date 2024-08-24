const User = require('../models/user');

exports.verifySignup = async (req, res) => {
    try {
        const { fullName, email, batch, domain, phone,username, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered. Please use another email.' });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already taken. Please choose another username.' });
        }

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            batch,
            domain,
            phone,
            username,
            password 
        });

      
        await newUser.save();

       
        res.json({ message: 'User registered successfully! Please log in.' });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
