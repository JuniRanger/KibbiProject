import Order from '../Models/OrderModel.js'
import Product from '../Models/ProductModel.js';

async function getOrders(userId, lastDoc = null) {
    try {
        let query = Order.find({ cliente: userId })
            .sort({ fechaHoraEntrega: -1 })
            .limit(20);

        if (lastDoc && typeof lastDoc !== 'undefined') {
            query = query.skip(lastDoc); // Usamos skip para manejar la paginación
        }

        const orders = await query.exec();
        
        // MongoDB no tiene "lastDoc" de la misma forma que Firestore, pero podemos simularlo con "skip"
        const newLastVisible = orders.length ? orders[orders.length - 1]._id : null;

        return {
            orders,
            lastDoc: newLastVisible
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Obtener órdenes por sus IDs
async function getOrdersById(orderIds) {
    try {
        // Usamos `$in` para buscar múltiples IDs en la colección de órdenes
        const orders = await Order.find({ _id: { $in: orderIds } });

        if (!orders.length) {
            throw new Error("No se encontraron órdenes con los IDs proporcionados");
        }

        return orders;
    } catch (error) {
        console.error("Error al obtener órdenes por IDs:", error.message);
        throw error;
    }
}

async function saveOrder(order) {
    try {
        const newOrder = new Order(order);
        await newOrder.save();
        return newOrder._id;
    } catch (error) {
        console.error("Error al guardar la orden en la base de datos:", error);
        throw error;
    }
}

async function updateOrder(id, updatedOrder) {
    try {
        const updatedOrderDoc = await Order.findByIdAndUpdate(id, updatedOrder, { new: true });
        if (!updatedOrderDoc) {
            throw new Error(`Orden con ID ${id} no encontrada.`);
        }
        return updatedOrderDoc;
    } catch (error) {
        console.error("Error al actualizar la orden:", error);
        throw error;
    }
}

async function deleteOrder(id) {
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            throw new Error(`Orden con ID ${id} no encontrada.`);
        }
        return { message: `Orden con ID ${id} eliminada exitosamente.` };
    } catch (error) {
        console.error("Error al eliminar la orden:", error);
        throw error;
    }
}

async function getAllOrdersWithPagination(skip, limit) {
    try {
        // Mongoose: obtenemos las órdenes con paginación
        const orders = await Order.find()
            .skip(skip)  // Aplicar el número de saltos para la paginación
            .limit(limit);  // Limitar el número de resultados

        console.log("Órdenes encontrados:", orders);
        return orders;  // Devolver las órdenes encontradas
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        throw error;
    }
}

export default {
    getOrders,
    saveOrder,
    getOrdersById,
    updateOrder,
    deleteOrder,
    getAllOrdersWithPagination
};
