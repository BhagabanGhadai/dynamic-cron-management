import ExecutionLog from '../models/executionLogSchema.js';

export const createExecutionLog = async (req, res) => {
    try {
        const executionLog = new ExecutionLog(req.body);
        await executionLog.save();
        res.status(201).json(executionLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllExecutionLogs = async (req, res) => {
    try {
        const logs = await ExecutionLog.find().populate('cronJobId', 'name');
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExecutionLogsByJobId = async (req, res) => {
    try {
        const logs = await ExecutionLog.find({ cronJobId: req.params.cronJobId }).populate('cronJobId', 'name');
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExecutionLogById = async (req, res) => {
    try {
        const log = await ExecutionLog.findById(req.params.id).populate('cronJobId', 'name');
        if (!log) return res.status(404).json({ message: 'ExecutionLog not found' });
        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExecutionLog = async (req, res) => {
    try {
        const log = await ExecutionLog.findByIdAndDelete(req.params.id);
        if (!log) return res.status(404).json({ message: 'ExecutionLog not found' });
        res.status(200).json({ message: 'ExecutionLog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function registerExecutionLog(cronJobId, status, responseStatus, responseBody, errorData) {

    try {
        await ExecutionLog.create({
            cronJobId: cronJobId,
            status,
            responseStatus,
            responseBody,
            error: errorData,
            executedAt: new Date()
        });
    } catch (logError) {
        console.error('Failed to save execution log:', logError);
    }
}