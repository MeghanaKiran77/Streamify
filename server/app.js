const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/video-streaming-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// Serve static files for video streaming
app.use('/uploads', express.static('uploads'));

// Video streaming endpoint
app.get('/stream/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const filePath = path.join(__dirname, 'uploads', fileId);

    console.log(`Requested file path: ${filePath}`); // Log file path for debugging

    if (!fs.existsSync(filePath)) {
        console.log(`File not found at path: ${filePath}`); // Log if file is not found
        return res.status(404).json({ message: 'File not found' });
    }

    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'File not found' });
            }
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }

        const range = req.headers.range;
        console.log(`Range: ${range}`); // Log Range header for debugging
        if (!range) {
            return res.status(416).json({ message: 'Requires Range header' });
        }

        const positions = range.replace(/bytes=/, '').split('-');
        const start = parseInt(positions[0], 10);
        const total = stats.size;
        const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        const chunksize = end - start + 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${total}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4', // Adjust this if your videos are in a different format
        });

        const stream = fs.createReadStream(filePath, { start, end });
        stream.on('open', () => {
            stream.pipe(res);
        });
        stream.on('error', (streamErr) => {
            res.status(500).json({ message: 'Internal server error', error: streamErr.message });
        });
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
};
app.use(globalErrorHandler);

module.exports = app;
