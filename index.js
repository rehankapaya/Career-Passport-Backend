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
const historyRoutes = require('./src/routes/historyRoutes')
const authRoutes = require('./src/routes/authRoutes.js')
const chatbotRoutes = require('./src/routes/chatbotRoutes.js')
// Connect to Database
connectDB();

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://careerpassport.vercel.app',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);  // allow the specific origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies/authorization headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/admin', adminRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/success-stories', succesStoriesRoutes);
app.use('/api/multimedia', multimediaRoutes);
app.use('/api/feedback', feedbackRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use("/api/quiz", quizRoutes);
app.use("/api/attempt", attemptRoutes);
app.use("/api/recommend", recommendRoutes);
app.use('/api/history', historyRoutes)
app.use('/api/auth', authRoutes)
app.get('/', (req, res) => {
    res.send('PathSeeker API Done chl ja multer :)');
});

const PORT = process.env.PORT || 3000;
console.log(PORT)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));