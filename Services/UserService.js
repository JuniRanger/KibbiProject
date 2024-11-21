import userRepository from '../Repositories/UserRepository.js';

async function getAllUsers() {
    return await userRepository.getUsers();
}

const getAllUsersWithPagination = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const users = await userRepository.getAllUsersWithPagination(skip, limit);
    console.log("service", users);
    return users;
};

const getTotalUsers = async () => {
    return await userRepository.countUsers();
};

export default {
    getAllUsers,
    getAllUsersWithPagination,
    getTotalUsers, // Exporta la función
};
