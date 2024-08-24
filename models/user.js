const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    batch: String,
    domain: String,
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+?[1-9]\d{1,10}$/, 'Please enter a valid mobile number']
    },
    username: { type: String, required: true, unique: true  },
    password: { type: String, required: true }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
            next(); 
        } catch (err) {
            next(err); // Pass error to the next middleware
        }
    } else {
        next(); 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
