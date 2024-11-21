import Restaurant from "../Models/RestaurantModel.js";
import User from "../Models/UserModel.js";

async function saveRestaurant(restaurantData) {
    try {
        const newRestaurant = new Restaurant(restaurantData);
        const savedRestaurant = await newRestaurant.save();

        const user = await User.findById(restaurantData.userId);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        user.restaurantes.push(savedRestaurant._id); // Asegúrate de que el esquema del usuario tenga esta relación
        await user.save();

        return savedRestaurant._id;
    } catch (error) {
        console.error('Error al agregar restaurante: ', error);
        throw error;
    }
}

// Obtener todos los restaurantes con paginación
async function getAllRestaurantsWithPagination(skip, limit) {
    try {
        const restaurants = await Restaurant.find()
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await Restaurant.countDocuments(); // Total de restaurantes para información adicional

        return {
            total,
            restaurants,
            currentPage: Math.ceil(skip / limit) + 1,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error("Error al obtener restaurantes con paginación:", error);
        throw error;
    }
}

// Obtener todos los restaurantes (sin paginación)
async function getRestaurants() {
    try {
        return await Restaurant.find();
    } catch (error) {
        console.error("Error al obtener todos los restaurantes:", error);
        throw error;
    }
}

// Obtener un restaurante por su ID
async function getRestaurantById(id) {
    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            throw new Error("Restaurante no encontrado");
        }
        return restaurant;
    } catch (error) {
        console.error("Error al obtener restaurante por ID:", error);
        throw error;
    }
}

// Actualizar un restaurante
async function updateRestaurant(id, data) {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, { new: true });
        if (!updatedRestaurant) {
            throw new Error("No se pudo actualizar el restaurante");
        }
        return updatedRestaurant;
    } catch (error) {
        console.error("Error al actualizar restaurante:", error);
        throw error;
    }
}

// Eliminar un restaurante
async function deleteRestaurant(restaurantId) {
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new Error("Restaurante no encontrado");
        }

        // Eliminar referencia en el usuario
        const user = await User.findById(restaurant.userId);
        if (user) {
            user.restaurantes = user.restaurantes.filter(id => id.toString() !== restaurantId);
            await user.save();
        }

        // Eliminar restaurante
        return await Restaurant.findByIdAndDelete(restaurantId);
    } catch (error) {
        console.error("Error al eliminar restaurante:", error);
        throw error;
    }
}

export default {
    saveRestaurant,
    getRestaurants,
    getAllRestaurantsWithPagination,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
};
