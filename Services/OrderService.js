// orderService.js
import orderRepository from "../Repositories/OrderRepository.js";

async function getAllOrders() {
    return await orderRepository.getOrders();
}

async function addOrder(orderData) {
    try {
        const { usuarioId, restauranteId, productsIds, estado, fechaHoraEntrega, notas } = orderData;

        const productsInfo = await productRepository.getProductsById(productsIds);

        // Calcular el total de la orden
        let total = 0;
        productsInfo.forEach(producto => {
            total += producto.precio;
        });

        // Crear una nueva instancia de la orden
        const order = new Order({
            usuarioId,
            restauranteId,
            productos: productsInfo,  
            estado,
            fechaHoraEntrega,
            notas,
            total  
        });

        const orderId = await orderRepository.saveOrder(order.toFirestore());

        return { id: orderId, order };
    } catch (error) {
        console.error("Error al agregar la orden:", error.message);
        throw new Error('Error al agregar la orden');
    }
}

const getAllOrdersWithPagination = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;  // Calcular el número de saltos para la paginación

    const orders = await orderRepository.getAllOrdersWithPagination(skip, limit);
    console.log("service", orders);

    return orders; // Asegúrate de retornar todas las órdenes, sin modificar su estructura
};

// Actualizar una orden existente
async function updateOrder(id, updateData) {
    try {
        const updatedOrder = await orderRepository.updateOrder(id, updateData);
        if (!updatedOrder) {
            return null;  
        }
        return updatedOrder;  
    } catch (error) {
        console.error(error.message);
        throw new Error('Error al actualizar la orden');
    }
}

// Eliminar una orden
async function deleteOrder(id) {
    try {

        const result = await orderRepository.deleteOrder(id);
        if (!result) {
            return false;  
        }
        return true;  
    } catch (error) {
        console.error(error.message);
        throw new Error('Error al eliminar la orden');
    }
}


export default {
    getAllOrders,
    addOrder,
    getAllOrdersWithPagination,
    deleteOrder,
    updateOrder
};
