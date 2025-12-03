require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
// mongoose.connect(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
// Add this line with your other routes
app.use('/api/jobs', require('./routes/job.routes'));

app.use('/api/auth', require('./routes/auth.routes'));
// Add other routes here as you build them
// app.use('/api/users', require('./routes/user.routes'));
// app.use('/api/admin', require('./routes/admin.routes'));
// app.use('/api/jobs', require('./routes/job.routes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Job Portal API is running!' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
