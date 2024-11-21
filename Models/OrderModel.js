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
        status: {
            type: String,
            enum: ['Pendiente', 'Procesado', 'Completado', 'Cancelado'], // Ajusta según tu lógica
            default: 'Pendiente'
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
