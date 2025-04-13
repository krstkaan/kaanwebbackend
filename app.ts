import express from 'express';
import authRoutes from './routes/authRoutes';
import lessonRoutes from './routes/lessonRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', lessonRoutes);

app.get('/', (_req, res) => {
    console.log('API çalışıyor');
});

export = app;
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});