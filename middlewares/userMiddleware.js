// Middleware para inyectar el user ID en req.params.id
export default function injectUserIdIntoParams(req, res, next) {
    if (req.user && req.user.id) {
        req.params.id = req.user.id; // Inyectar el ID del usuario autenticado
    } else {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    next();
}
