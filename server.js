const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/driver');
const rideRoutes = require('./routes/rides');
const userRoutes = require('./routes/users');

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set View Engine for Rendering EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// WebSocket Setup
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('locationUpdate', (data) => {
        // Broadcast location updates to teammates
        io.to(data.teammateSocketId).emit('teammateLocationUpdate', {
            latitude: data.latitude,
            longitude: data.longitude,
            role: data.role, // 'driver' or 'chaser'
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/driver', driverRoutes);
app.use('/rides', rideRoutes);
app.use('/users', userRoutes);

// Error Handling for Undefined Routes
app.use((req, res) => {
    res.status(404).render('partials/404'); // Assumes a 404.ejs file exists in /views/partials
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));