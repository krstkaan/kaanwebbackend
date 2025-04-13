import express from 'express';
import { getLessons } from '../controllers/lessonController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/getLessons', authenticateToken, getLessons);

export default router;