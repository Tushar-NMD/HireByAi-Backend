const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
        minlength: [20, "Description must be at least 20 characters"],
        maxlength: [5000, "Description cannot exceed 5000 characters"]
    },
    skills: {
        type: [String],
        required: [true, "At least one skill is required"],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: "At least one skill is required"
        }
    },
    experience: {
        type: String,
        required: [true, "Experience level is required"],
        enum: {
            values: ["Fresher", "0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
            message: "Please select a valid experience level"
        }
    },
    salary: {
        min: {
            type: Number,
            required: [true, "Minimum salary is required"],
            min: [0, "Salary cannot be negative"]
        },
        max: {
            type: Number,
            required: [true, "Maximum salary is required"],
            min: [0, "Salary cannot be negative"]
        }
    },
    location: {
        type: String,
        required: [true, "Job location is required"],
        trim: true
    },
    jobType: {
        type: String,
        required: [true, "Job type is required"],
        enum: {
            values: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
            message: "Please select a valid job type"
        }
    },
    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
    openings: {
        type: Number,
        required: [true, "Number of openings is required"],
        min: [1, "At least 1 opening is required"],
        default: 1
    },
    status: {
        type: String,
        enum: ["Active", "Closed", "Draft"],
        default: "Active"
    },
    deadline: {
        type: Date,
        required: [true, "Application deadline is required"],
        validate: {
            validator: function(v) {
                return v > Date.now();
            },
            message: "Deadline must be a future date"
        }
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }]
}, { 
    timestamps: true 
});

// Index for faster searches
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });

// Virtual for number of applicants
jobSchema.virtual('applicantCount').get(function() {
    return this.applicants ? this.applicants.length : 0;
});

// Ensure virtuals are included in JSON
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Job", jobSchema);
