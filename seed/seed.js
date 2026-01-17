import mongoose from 'mongoose';
import CronJob from '../models/cronJobSchema.js';
import ExecutionLog from '../models/executionLogSchema.js';

const dbConnection = async () => {
    try {
        // Attempt to connect using the docker service name first, generic localhost specific logic could be added if needed but keeping it simple as per existing config structure.
        // For running outside docker, user might need to change 'mongo' to 'localhost' if port is exposed.
        const uri = process.env.DB_URI || 'mongodb://admin:secretpassword@mongo:27017/advanced_cron?authSource=admin';
        await mongoose.connect(uri, {
            useNewUrlParser: true
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

const seedData = async () => {
    await dbConnection();

    try {
        console.log('Clearing existing data...');
        await CronJob.deleteMany({});
        await ExecutionLog.deleteMany({});

        console.log('Seeding CronJobs...');
        const cronJobs = await CronJob.insertMany([
            {
                name: 'Daily Report',
                cronExpression: '0 0 * * *',
                webhookUrl: 'https://example.com/webhooks/daily-report',
                isActive: true
            },
            {
                name: 'Weekly Cleanup',
                cronExpression: '0 0 * * 0',
                webhookUrl: 'https://example.com/webhooks/cleanup',
                isActive: false
            },
            {
                name: 'Hourly Sync',
                cronExpression: '0 * * * *',
                webhookUrl: 'https://example.com/webhooks/sync',
                isActive: true
            }
        ]);

        console.log('Data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
