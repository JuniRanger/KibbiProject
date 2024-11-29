import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        cliente: {
            type: String,
            required: true
        },
        productos: {
            type: [Object],
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        estado: {
            type: String,
            enum: ['pendiente', 'aceptado', 'preparando', 'completado', 'cancelado'], // Ajusta según tu lógica
            default: 'pendiente' // Asegura que esté en minúsculas para consistencia
        },
        notas: {
            type: String,
            default: null
        },
        restauranteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'restaurants', // Ajusta el nombre según tu colección
            required: true
        },
        fechaHoraEntrega: {
            type: Date,
            required: false
        },
        fechaOrden: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // Agrega automáticamente createdAt y updatedAt
    }
);

// Asegurarse de que el modelo no se registre múltiples veces
const Order = mongoose.models.orders || mongoose.model('orders', OrderSchema);

export default Order;
