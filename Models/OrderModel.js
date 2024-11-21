import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        OrderID: {
            type: String,
            required: true,
            unique: true
        },
        Client: {
            type: String,
            required: true
        },
        Products: {
            type: [Object], 
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], // Ajusta según tu lógica
            default: 'Pending'
        },
        delivery_time: {
            type: Date,
            required: false
        },
        order_date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // Agrega automáticamente createdAt y updatedAt
    }
);

// Asegurarse de que el modelo no se registre múltiples veces
const Order = mongoose.models.order || mongoose.model('order', OrderSchema);

export default Order;
