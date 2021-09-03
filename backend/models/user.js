const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [30, 'Name cannot exceed 30 characters'],
        required: true
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email address'],
        required: [true, 'Please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be longer than 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String, 
        default: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date

})

//Hash the password before storing it in the database
userSchema.pre('save', async function save(next) {
    try {
        if(!this.isModified('password')) return next();

        this.password = await bcrypt.hash(this.password, 10)
    }
    catch(err) {
        return next(err)
    }
})

//generate authentication token for registered user
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_PRIVATEKEY, {
        expiresIn: process.env.JWT_EXPIRATION_TIME
    });
    return token;
}

//Compare password using bcrypt.compare
userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
};

//Reset forgotten password using crypto 
userSchema.methods.getResetPasswordToken = function() {
    //Generate crypto token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Encrypt the token and set it to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Set the token expiry time to 30 mins
    this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    
    return resetToken;
}

module.exports = mongoose.model('User', userSchema);
