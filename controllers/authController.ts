import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { getUserByUsername, createUser } from '../models/authModel';
import { ApiResponse } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            ApiResponse.error({
                res,
                statusCode: 400,
                message: 'Kullanıcı adı ve şifre gereklidir.',
            });
            return;
        }

        const { data: existing } = await getUserByUsername(username);
        if (existing) {
            ApiResponse.error({
                res,
                statusCode: 409,
                message: 'Bu kullanıcı adı zaten alınmış.',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await createUser(username, hashedPassword);

        if (error) {
            ApiResponse.error({
                res,
                statusCode: 500,
                message: error.message,
            });
            return;
        }

        ApiResponse.success({
            res,
            statusCode: 201,
            message: 'Kayıt başarılı',
            data: data?.[0],
        });
    } catch {
        ApiResponse.error({
            res,
            statusCode: 500,
            message: 'Sunucu hatası',
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const { data: user, error } = await getUserByUsername(username);
    if (error || !user) {
        ApiResponse.error({ res, statusCode: 401, message: 'Kullanıcı adı veya şifre hatalı' });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        ApiResponse.error({ res, statusCode: 401, message: 'Kullanıcı adı veya şifre hatalı' });
        return;
    }

    const token = generateToken(user.id);
    ApiResponse.success({
        res,
        data: {
            token,
            user: { id: user.id, username: user.username, yetki: user.yetki },
        },
    });
};