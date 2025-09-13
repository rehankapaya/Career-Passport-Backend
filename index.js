const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');

require('dotenv').config();
const connectDB = require('./src/config/db');
const adminRoutes = require('./src/routes/adminRoutes');
const careerRoutes = require('./src/routes/careerRoutes');
const userRoutes = require('./src/routes/userRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const userProfileRoutes = require('./src/routes/userProfileRoutes');
const succesStoriesRoutes = require('./src/routes/successStoriesRoutes');
const multimediaRoutes = require('./src/routes/multimediaRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes')
const bookmarkRoutes = require('./src/routes/bookmarkRoutes')
const quizRoutes = require("./src/routes/quizRoutes.js");
const attemptRoutes = require("./src/routes/attemptRoutes.js");
const recommendRoutes = require("./src/routes/recommendRoutes.js");
// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors(
    {origin: 'http://localhost:5173', credentials: true}
)); 
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/success-stories', succesStoriesRoutes);
app.use('/api/multimedia', multimediaRoutes);
app.use('/api/feedback',feedbackRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use("/api/quiz", quizRoutes);
app.use("/api/attempt", attemptRoutes);
app.use("/api/recommend", recommendRoutes);

app.get('/', (req, res) => {
    res.send('PathSeeker API is running...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));