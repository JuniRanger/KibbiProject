import mongoose from 'mongoose';

// Esquema de Mongoose con timestamps habilitados
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true, // Elimina espacios en blanco iniciales y finales
        },
        password: {
            type: String,
            required: true,
        },
        correo: {
            type: String,
            required: true,
            unique: true, // Evita duplicados
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación básica de formato de correo
        },
        telefono: {
            type: String,
            required: true,
            match: /^\+?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, // Asegura que solo contenga dígitos
        },
        restaurantes: {
            type: [mongoose.Schema.Types.ObjectId], // Referencia a IDs de restaurantes
            ref: 'Restaurant',
            default: [], // Valor por defecto: arreglo vacío
        },
    },
    {
        timestamps: true, // Agrega automáticamente createdAt y updatedAt
    }
);

// Verificación para evitar múltiples registros del modelo
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
