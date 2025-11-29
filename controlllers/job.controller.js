const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            skills,
            experience,
            salary,
            location,
            jobType,
            company,
            openings,
            deadline,
            status
        } = req.body;

        // Validate required fields
        if (!title || !description || !skills || !experience || !salary || !location || !jobType || !company || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Validate salary range
        if (salary.min > salary.max) {
            return res.status(400).json({
                success: false,
                message: "Minimum salary cannot be greater than maximum salary"
            });
        }

        // Create job
        const job = await Job.create({
            title,
            description,
            skills: Array.isArray(skills) ? skills : [skills],
            experience,
            salary,
            location,
            jobType,
            company,
            openings: openings || 1,
            deadline,
            status: status || "Active",
            postedBy: req.user.id // From auth middleware
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job
        });

    } catch (error) {
        console.error("Create job error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating job",
            error: error.message
        });
    }
};

// @desc    Get all jobs (with filters and pagination)
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            jobType,
            experience,
            location,
            skills,
            search
        } = req.query;

        // Build filter object
        const filter = {};

        if (status) filter.status = status;
        if (jobType) filter.jobType = jobType;
        if (experience) filter.experience = experience;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            filter.skills = { $in: skillsArray };
        }

        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get jobs with pagination
        const jobs = await Job.find(filter)
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await Job.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: jobs.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: jobs
        });

    } catch (error) {
        console.error("Get all jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching jobs",
            error: error.message
        });
    }
};
// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });

    } catch (error) {
        console.error("Get job by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching job",
            error: error.message
        });
    }
};


// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check if user is the one who posted the job
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this job"
            });
        }

        // Validate salary if being updated
        if (req.body.salary) {
            if (req.body.salary.min > req.body.salary.max) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum salary cannot be greater than maximum salary"
                });
            }
        }

        // Update job
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('postedBy', 'name email');

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });

    } catch (error) {
        console.error("Update job error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating job",
            error: error.message
        });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check if user is the one who posted the job
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this job"
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting job",
            error: error.message
        });
    }
};

// @desc    Get jobs posted by logged-in admin
// @route   GET /api/jobs/my-jobs
// @access  Private/Admin
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {
        console.error("Get my jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching your jobs",
            error: error.message
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
};
