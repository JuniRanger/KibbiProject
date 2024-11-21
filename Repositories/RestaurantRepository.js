import Restaurant from "../Models/RestaurantModel.js";
import User from "../Models/UserModel.js";

async function saveRestaurant(restaurantData) {
    try {
        const newRestaurant = new Restaurant(restaurantData)
        const savedRestaurant = await newRestaurant.save()

        const user = await User.findById(restaurantData.userId)

        if(!user){
            throw new Error("Usuario no encontrado");
        }

        user.restaurantes.push(savedRestaurant._id)
        await user.save()

        return savedRestaurant._id
    } catch (error) {
        console.error('Error al agregar restaurante: ', error);
        throw error;
    }
}

// Función para obtener todos los restaurantes con paginación
async function getAllRestaurantsWithPagination(skip, limit) {
    try {
        const restaurantRef = client.db('DevKibbi').collection("restaurants");
        const restaurants = await restaurantRef.find()  // Sin filtrar por ciudad
            .skip(skip)  // Aplicar el skip para la paginación
            .limit(limit)  // Aplicar el límite de resultados
            .toArray();  // Convertir a un array de resultados

        console.log("Restaurantes encontrados:", restaurants);
        return restaurants;
    } catch (error) {
        console.error("Error al obtener restaurantes:", error);
        throw error;
    }
}

async function getRestaurants() {
    try {
        const restaurantRef = client.db('DevKibbi').collection("restaurants");
        const restaurants = await restaurantRef.find().toArray();
        console.log("restaurantes obtenidos:", restaurants);
        return restaurants;
    } catch (error) {
        console.error("Error al obtener restaurantes:", error);
        throw error; 
    }
}

async function deleteRestaurant(restaurantId) {
    try {
        const restaurant = await Restaurant.findById(restaurantId)
        const deletedRestaurant = restaurant.delete()

        return deletedRestaurant
    } catch (error) {
        console.error(error)
        throw error
    }
}

export default {
    saveRestaurant,
    getRestaurants,
    getAllRestaurantsWithPagination
};
