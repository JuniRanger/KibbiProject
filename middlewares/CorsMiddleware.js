import cors from 'cors';

const allowedDomains = [
    'http://127.0.0.1:5500',
    'https://frontapi-0cuw.onrender.com/',
    'http://localhost:3000',
    'https://backapi-29lg.onrender.com'
    
];

const corsOptions = {
    origin: function (origin, callback) {
        // verificar dominio
        if (allowedDomains.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Dominio no autorizado por CORS'));
        }
    },

    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // solamente si se usan cookies o credenciales
};

export default cors(corsOptions);
