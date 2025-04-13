import { supabase } from '../utils/supabase';

export const getUserByUsername = async (username: string) => {
    return await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
};

export const createUser = async (username: string, password: string) => {
    return await supabase
        .from('users')
        .insert([{ username, password, yetki: 'user' }]);
};