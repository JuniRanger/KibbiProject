import restaurantRepository from "../Repositories/RestaurantRepository.js";

async function addRestaurant(data) {
    try {
        const restaurant = {
            nombre: data.nombre,
            correo: data.correo,
            telefono: data.telefono,
            direccion: data.direccion,
            city: data.city,
            userId: data.userId
        };

        const restaurantId = await restaurantRepository.saveRestaurant(restaurant);
        console.log('Nuevo restaurante', restaurantId);
        return { id: restaurantId, ...restaurant };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Obtener todos los restaurantes con paginación
const getAllRestaurantsWithPagination = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return await restaurantRepository.getAllRestaurantsWithPagination(skip, limit);
};

// Obtener todos los restaurantes
async function getAllRestaurants() {
    return await restaurantRepository.getRestaurants();
}

// Obtener un restaurante por su ID
async function getRestaurantById(id) {
    try {
        const restaurant = await restaurantRepository.getRestaurantById(id);
        if (!restaurant) {
            throw new Error("Restaurante no encontrado");
        }
        return restaurant;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Actualizar un restaurante
async function updateRestaurant(id, data) {
    try {
        const updatedRestaurant = await restaurantRepository.updateRestaurant(id, data);
        if (!updatedRestaurant) {
            throw new Error("No se pudo actualizar el restaurante");
        }
        return updatedRestaurant;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Eliminar un restaurante
async function deleteRestaurant(id) {
    try {
        const deleted = await restaurantRepository.deleteRestaurant(id);
        if (!deleted) {
            throw new Error("No se pudo eliminar el restaurante");
        }
        return { message: "Restaurante eliminado correctamente" };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getRestaurantsByUserId(userId){
    try {
        const restaurants = await restaurantRepository.getRestaurantsByUser(userId);

        if(!restaurants || restaurants.length === 0) {
            throw new Error("No se encontraron resturantes para este usuario");
        }

        return restaurants;
    } catch (error) {
        console.error(error.message)
        
    }
}


export default {
    addRestaurant,
    getAllRestaurants,
    getAllRestaurantsWithPagination,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByUserId
};
