import mongoose from "mongoose";

const executionLogSchema = new mongoose.Schema({
    cronJobId: { type: mongoose.Schema.Types.ObjectId, ref: "CronJob", required: true },
    status: { type: String, enum: ["SUCCESS", "FAILURE"], required: true },
    responseStatus: { type: Number },
    responseBody: { type: mongoose.Schema.Types.Mixed },
    error: { type: mongoose.Schema.Types.Mixed },
    executedAt: { type: Date, default: Date.now }
},{ timestamps: true });

const ExecutionLog = mongoose.model("ExecutionLog", executionLogSchema);
export default ExecutionLog;