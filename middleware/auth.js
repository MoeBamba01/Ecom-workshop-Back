const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

async function protect(req, res, next) {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer")) {
        res.status(401).json({ message: "Non autorisé, token manquant" });
        return;
    }

    try{
        const token = header.split(" ")[1];
        const deocoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(deocoded.id).select("-password");

        if (!req.user) return res.status(401).json({ message: "Non autorisé, utilisateur non trouvé" });
        next();
    } catch (error) {
        res.status(401).json({ message: "Non autorisé, token invalide" });
    }
}


function admin(req, res, next) {
    if (req.user?.isAdmin) return next();
    res.status(403).json({ message: "Non autorisé, accès réservé aux administrateurs" });
}

module.exports = { protect, admin };