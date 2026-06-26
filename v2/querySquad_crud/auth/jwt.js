const jwt = require("jsonwebtoken");
const config = require("../config/config");

const signToken = (payload, expiresIn = "8h") => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

const getTokenFromRequest = (req) => {
    const authHeader = req.headers?.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }

    const cookieHeader = req.headers?.cookie || "";
    const cookieMatch = cookieHeader.match(/(?:^|; )token=([^;]+)/);
    return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
};

module.exports = {
    signToken,
    verifyToken,
    getTokenFromRequest
};
