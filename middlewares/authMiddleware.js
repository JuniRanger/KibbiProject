import jwt from 'jsonwebtoken';
import userRepository from '../Repositories/UserRepository.js';

export async function verifyToken(req, res, next) {
    const bearerHeader = req.header('Authorization');
    if (!bearerHeader) {
        console.log('Authorization header missing');
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    const token = bearerHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded || !decoded.username) {
            throw new Error("Username missing in token");
        }

        const user = await userRepository.getUserByUsername(decoded.username);

        if (!user) {
            console.log(`Usuario no encontrado para el username: ${decoded.username}`);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        req.user = { ...decoded };

        next(); 
    } catch (err) {
        console.error('Token Verification Error:', err.message);
        res.status(401).json({ error: 'Token inválido' });
    }
}

export default verifyToken;
