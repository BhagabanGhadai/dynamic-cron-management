import mongoose from "mongoose";

const cronJobSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    cronExpression: { type: String, required: true },
    webhookUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
},{ timestamps: true });

const CronJob = mongoose.model("CronJob", cronJobSchema);

export default CronJob;