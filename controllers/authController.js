const User = require("../models/User");
const jwt = require("jsonwebtoken");


function generateToken(id){
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}


function userResponse(user){
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    };
}

async function register(req, res) {

    try{
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tous les Champs sont requis" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    res.status(201).json(userResponse(user));
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Email ou mot de passe invalide" });
        }

        res.json(userResponse(user));

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getMe(req, res) {
    res.json(req.user);
}

module.exports = {
    register,
    login,
    getMe,
};