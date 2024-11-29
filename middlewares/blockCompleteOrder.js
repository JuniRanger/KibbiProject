import Order from "../Models/OrderModel.js";

export async function blockCompletdOrders(req, res, next){
    try {

        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if(!order) {
            return res.status(404).json({
                message: 'Orden no encontrada'
            });
        }

        if(order.estado === 'completado'){
            return res.status(400).json({
                message: 'NO se pueden modificar ordenes completadas'
            });
        }

        next();
    } catch (error) {
        return res.stauts(500).json({ 
            message: 'Error en el middleware',
            error: error.message
        });
    }
}