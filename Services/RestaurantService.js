import restaurantRepository from "../Repositories/RestaurantRepository.js";

async function addRestaurant(data) {
    try {

        //objeto plano para mongodb
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

// Función para obtener todos los restaurantes con paginación
const getAllRestaurantsWithPagination = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;  

    return await restaurantRepository.getAllRestaurantsWithPagination(skip, limit);
};

async function getAllRestaurants() {
    return await restaurantRepository.getRestaurants();
}

export default {
    addRestaurant,
    getAllRestaurants,
    getAllRestaurantsWithPagination
};
