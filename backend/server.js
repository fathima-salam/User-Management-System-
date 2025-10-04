import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS should be before other middleware
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongodb connected succesfully');
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log('server is running on port:', PORT)
        })
    })
    .catch((err) => {
        console.log('mongodb connection error', err);
        process.exit(1)
    });

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});