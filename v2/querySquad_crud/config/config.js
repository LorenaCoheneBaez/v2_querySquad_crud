const path = require("path");

try {
    require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
} catch (error) {
    console.error("Error loading .env file:", error);
    process.exit(1);
}

const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/query_squad_db";
const sessionSecret = process.env.SESSION_SECRET || "querysquad";
const jwtSecret = process.env.JWT_SECRET || "querysquad-jwt-secret";

module.exports = {
    port,
    mongoUri,
    sessionSecret,
    jwtSecret
};
