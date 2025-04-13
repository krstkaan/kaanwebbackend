import { Response } from 'express';
import { supabase } from '../utils/supabase';
import { ApiResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getLessons = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('*');

    if (lessonError) {
      ApiResponse.error({ res, statusCode: 500, message: lessonError.message });
      return;
    }

    const lessonsWithExams = await Promise.all(
      lessons.map(async (lesson: any) => {
        const { data: exams } = await supabase
          .from('exams')
          .select('*')
          .eq('lessonId', lesson.id);

        return {
          ...lesson,
          exams: exams || [],
        };
      })
    );

    ApiResponse.success({ res, data: lessonsWithExams });
  } catch {
    ApiResponse.error({ res, statusCode: 500, message: 'Sunucu hatası' });
  }
};