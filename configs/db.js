import mongoose from 'mongoose';
import { env } from './env.js';

const { MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_PORT } = env;


// Construct the URI. Note: authSource=admin is required for Docker containers.
const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/myapp?authSource=admin`;
export const dbConnection = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
    }
}