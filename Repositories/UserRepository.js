import User from "../Models/UserModel.js";

async function saveUser(userData) {
    try {
        const user = new User(userData);
        const savedUser = await user.save();
        return savedUser._id
    } catch (error) {
        console.error("Error al agregar usuario: ", error);
        throw error;
    }
}

async function countUsers() {
    try {
        const usersCollection = client.db('DevKibbi').collection('Users');
        const totalUsers = await usersCollection.countDocuments();
        return totalUsers;
    } catch (error) {
        console.error('Error al contar los usuarios:', error);
        throw error;
    }
}

async function getUserByUsername(username) {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error; 
    }
}

async function getUserById(userId){
    try {
        const user = await User.findById(userId);

        if(!user){
            throw new Error("Usuario no encontrado");
        }

        return user;
    } catch (error) {
        console.error(error.message);
        throw error
    }
}

async function getUsers() {
    try {
        const users = await User.find()
        return users
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error; 
    }
}

async function getUsernameById(userId){
    try {
        const user = await User.findById(userId);

        if(!user){
            throw new Error("Usuario no encontrado en la base de datos");
        }

        return user.username
    } catch (error) {
        console.error(error.message);
    }
}

async function getAllUsersWithPagination(skip, limit) {
    try {
        const usersCollection = client.db('DevKibbi').collection("users");

        // Obtener los usuarios con paginación
        const users = await usersCollection.find()
            .skip(skip)  // Aplicar el número de saltos para la paginación
            .limit(limit)  // Limitar el número de resultados
            .toArray();  // Convertir a un array

        console.log("Usuarios encontrados:", users);
        return users;  // Devolver los usuarios obtenidos
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw error;
    }
}


export default {
    saveUser,
    getUserByUsername,
    getUsers,
    getAllUsersWithPagination,
    countUsers,
    getUserById,
    getUsernameById
};
