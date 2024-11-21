import bcrypt from 'bcryptjs'; 
import User from '../Models/UserModel.js'; 
import userRepository from '../Repositories/UserRepository.js';
import jwt from 'jsonwebtoken';

async function register(user) {
    try {
        if (!user.password) { 
            throw new Error('La contraseña no puede estar vacía');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        const userData = {
            username: user.username,
            password: hashedPassword,
            correo: user.correo,
            telefono: user.telefono,
            restaurantes: user.restaurantes || [], // Restaurantes por defecto vacío
        };

        // Guardar el usuario usando el repositorio
        const userId = await userRepository.saveUser(userData);

        console.log('Usuario registrado con ID:', userId);

        // Retornar el ID y username del usuario registrado
        return { id: userId, username: user.username };
    } catch (err) {
        console.error('Error al registrar usuario:', err.message);
        throw err; 
    }
}

async function login(username, password) {
    const user = await userRepository.getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales invalidas');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRES_IN });
    return token;
}

export default {
    register,
    login
};
