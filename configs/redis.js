import redis from 'ioredis';
import { env } from './env.js';

const redisClient = new redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    maxRetriesPerRequest: null
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error);
})
export default redisClient;
