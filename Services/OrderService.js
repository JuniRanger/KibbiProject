// orderService.js
import OrderRepository from "../Repositories/OrderRepository.js";
import orderRepository from "../Repositories/OrderRepository.js";
import productRepository from "../Repositories/ProductRepository.js";
import UserRepository from "../Repositories/UserRepository.js";

async function getAllOrders() {
    return await orderRepository.getOrders();
}

async function addOrder(orderData) {
    try {
        const { userId, restauranteId, productsIds, estado, fechaHoraEntrega, notas } = orderData;

        const productsInfo = await productRepository.getProductsById(productsIds);

        const cliente = await UserRepository.getUsernameById(userId)
        // Calcular el total de la orden
        let total = 0;
        productsInfo.forEach(producto => {
            total += producto.precio;
        });

        // Crear una nueva instancia de la orden
        const order = {
            cliente,
            restauranteId,
            productos: productsInfo,  
            estado,
            fechaHoraEntrega,
            notas,
            total  
        };

        const orderId = await orderRepository.saveOrder(order);

        return { id: orderId, ...order };
    } catch (error) {
        console.error("Error al agregar la orden:", error.message);
        throw new Error('Error al agregar la orden');
    }
}

const getAllOrdersWithPagination = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;  // Calcular el número de saltos para la paginación

    const orders = await orderRepository.getAllOrdersWithPagination(skip, limit);
    console.log("service", orders);

    return orders;
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

async function getOrderById(orderId) {
    try {
        const order = await orderRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("Orden no encontrada");
        }
        return order;
    } catch (error) {
        console.error("Error al obtener la orden por ID:", error);
        throw error;
    }
}

async function getUserOrders(userId) {
    try {
        // Obtener las órdenes del usuario a través del repositorio
        const orders = await orderRepository.getOrdersByUser(userId);

        return orders; // Retornar las órdenes al controlador o a quien llame al servicio
    } catch (error) {
        console.error("Error en el servicio de obtener órdenes del usuario:", error.message);
        throw new Error("Error al obtener las órdenes del usuario.");
    }
}

async function getOrdersByRestaurant(restaurantId) {
    console.log("Recibiendo ID de restaurante en el servicio:", restaurantId); // Log del ID
    try {
        const orders = await orderRepository.getOrdersByRestaurant(restaurantId);
        console.log("Órdenes devueltas del repositorio:", orders); // Log de las órdenes devueltas
        return orders; // Devuelve las órdenes tal como están
    } catch (error) {
        console.error("Error al obtener órdenes por restaurante:", error);
        throw error;
    }
}

async function getCompletedOrdersByUser(userId) {
    try {
        const orders = await orderRepository.getCompletedOrdersByUser(userId);
        return orders; // Devuelve las órdenes completadas
    } catch (error) {
        console.error("Error al obtener órdenes completadas del usuario:", error);
        throw error;
    }
}

export default {
    getAllOrders,
    addOrder,
    getAllOrdersWithPagination,
    deleteOrder,
    updateOrder,
    getUserOrders,
    getOrdersByRestaurant,
    getOrderById,
    getCompletedOrdersByUser,
};
