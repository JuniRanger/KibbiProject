import Order from '../Models/OrderModel.js'
import Product from '../Models/ProductModel.js';

    async function getOrders(userId, lastDoc = null) {
        try {
            let query = firestoreAdmin.collection('Orders')
            .where('id', '==', userId)
            .orderBy('fechaHora', 'desc')
            .limit(20)

            if (lastDoc && typeof lastDoc !== 'undefined') {
                query = query.startAfter(lastDoc);
            }
            
            const querySnapshot = await query.get()

            const orders = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))

            const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

            return{
                orders,
                lastDoc: newLastVisible
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

async function getOrderById(order) {
    try {
        const orderDoc = await firestoreAdmin.collection('Orders').doc(order.id).get();
        if (!orderDoc.exists) {
            throw new Error(`Orden con ID ${order.id} no encontrada.`);
        }
        return { id: orderDoc.id, ...orderDoc.data() };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function saveOrder(order) {
    try {
        const newOrder = await new Order(order).save();
        return newOrder._id
    } catch (error) {
        console.error("Error al guardar la orden en la base de datos:", error);
        throw error;
    }
}

async function updateOrder(id, updatedOrder) {
    try {
        const orderRef = firestoreAdmin.collection('Orders').doc(id);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            throw new Error(`Orden con ID ${id} no encontrada.`);
        }

        await orderRef.update(updatedOrder); 
        const updatedOrderDoc = await orderRef.get(); 
        return { id: updatedOrderDoc.id, ...updatedOrderDoc.data() };
    } catch (error) {
        console.error("Error al actualizar la orden:", error);
        throw error;
    }
}

async function deleteOrder(id) {
    try {
        const orderRef = firestoreAdmin.collection('Orders').doc(id);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            throw new Error(`Orden con ID ${id} no encontrada.`);
        }

        await orderRef.delete(); // Delete the order
        return { message: `Orden con ID ${id} eliminada exitosamente.` };
    } catch (error) {
        console.error("Error al eliminar la orden:", error);
        throw error;
    }
}

async function getAllOrdersWithPagination(skip, limit) {
    try {
        const ordersCollection = client.db('DevKibbi').collection("orders");

        // Obtener las órdenes con paginación
        const orders = await ordersCollection.find()
            .skip(skip)  // Aplicar el número de saltos para la paginación
            .limit(limit)  // Limitar el número de resultados
            .toArray();  // Convertir a un array

        console.log("Órdenes encontrados:", orders);
        return orders;  // Devolver las órdenes mapeadas
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        throw error;
    }
}

export default {
    getOrders,
    saveOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
    getAllOrdersWithPagination
};
