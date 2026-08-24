import express from 'express';
import cors from 'cors';
import cookieParsor from 'cookie-parser';
import dotenv from 'dotenv';
import { planRouter } from './routes/plan.js';
import { profileRouter } from './routes/profile.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParsor());
app.use(express.json());

//API routes

app.use('/api/plan', planRouter);
app.use('/api/profile', profileRouter);

// Vercel handles the server lifecycle, so we export the app instance.
// The app.listen() block is commented out so you can still run it locally if needed.
// app.listen(PORT, () => {
//    console.log(`Server is running on port ${PORT}`);
//  });
export default app;