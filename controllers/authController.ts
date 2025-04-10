import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../utils/supabase';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir.' });

        const { data: existing } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (existing)
            return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase.from('users').insert([
            { username, password: hashedPassword, yetki: 'user' }
        ]);

        if (error) return res.status(500).json({ error: error.message });

        res.status(201).json({ message: 'Kayıt başarılı', user: data?.[0] });

    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};


// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<any>  => {
    const { username, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !user)
        return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
        return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });

    const token = generateToken(user.id);

    return res.json({ token, user: { id: user.id, username: user.username, yetki: user.yetki } });
};
