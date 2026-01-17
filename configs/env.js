const MONGO_HOST = process.env.DB_HOST || 'localhost';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const MONGO_USER = process.env.DB_USER || 'admin';
const MONGO_PASS = process.env.DB_PASS || 'secretpassword';
const MONGO_PORT = 27017;
const APP_PORT = process.env.APP_PORT || 3000;

export const env = {
    MONGO_HOST,
    MONGO_USER,
    MONGO_PASS,
    MONGO_PORT,
    REDIS_HOST,
    REDIS_PORT,
    APP_PORT
}