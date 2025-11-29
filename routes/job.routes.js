const express = require('express');
const router = express.Router();
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
} = require('../controlllers/job.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes (Admin only)
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);
router.get('/admin/my-jobs', protect, adminOnly, getMyJobs);

module.exports = router;
