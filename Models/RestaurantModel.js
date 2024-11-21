import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true,
            unique: true, // Asegura que no se dupliquen correos electrónicos
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validación básica de formato de correo
        },
        telefono: {
            type: String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, // Referencia a un usuario si es necesario
            ref: 'User',
            required: true
        },
        categorias: {
            type: [String], // Arreglo de cadenas
            default: [] // Si no se especifican, será un arreglo vacío
        },
        fechaRegistro: {
            type: Date,
            default: Date.now // Se establece automáticamente al guardar
        }
    },
    {
        timestamps: true // Agrega createdAt y updatedAt automáticamente
    }
);

// Verificación para evitar múltiples registros del modelo
const Restaurant = mongoose.models.Restaurants || mongoose.model('Restaurants', RestaurantSchema);

export default Restaurant;
