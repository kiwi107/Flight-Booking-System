const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');


dotenv.config({ path: 'config.env' });


const register = async (req, res) => {
    try {
        const username = req.body.username;
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(req.body.password, salt);
        const existingUser = await User.findOne({ username: username })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const newUser = new User({ username: username, password: password })
        await newUser.save()
        //authentication
        const payload = {
            userId: newUser._id,
            username: newUser.username
        }
        const secretKey = process.env.ACCESS_TOKEN_SECRET;

        const token = jwt.sign(payload, secretKey, {
            expiresIn: '1h', // Token expiration time
        });

        res.cookie('token', token, {
            httpOnly: true,
        });
        res.redirect('/');




    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;


        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }


        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }


        const payload = {
            userId: existingUser._id,
            username: existingUser.username
        }
        const secretKey = process.env.ACCESS_TOKEN_SECRET;


        const token = jwt.sign(payload, secretKey, {
            expiresIn: '1h', // Token expiration time
        });

        req.session.user = existingUser;
    
        // res.cookie('token', token, {
        //     httpOnly: true,
        // });

        res.status(200).json({ auth: true, token: token, user: existingUser });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json(auth = false, { message: 'Login failed' });
    }
};

const logout = (req, res) => {
    // res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    logout
};


