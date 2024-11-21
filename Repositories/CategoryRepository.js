import mongoose from "mongoose";
import Category from "../Models/CategoryModel.js";
import Restaurant from "../Models/RestaurantModel.js";

async function getCategoriesWithPagination(skip, limit) {
    try {
        const categoriesCollection = client.db('DevKibbi').collection('categories');
        const categories = await categoriesCollection.find()
            .skip(skip)
            .limit(limit)
            .toArray();
        return categories;
    } catch (error) {
        console.error('Error al obtener categorías con paginación:', error);
        throw error;
    }
}

async function countCategories() {
    try {
        const categoriesCollection = client.db('DevKibbi').collection('categories');
        const totalCategories = await categoriesCollection.countDocuments();
        return totalCategories;
    } catch (error) {
        console.error('Error al contar categorías:', error);
        throw error;
    }
}

async function saveCategory(categoryData) {
    try {
        const { nombre, restaurantId } = categoryData;

        if (mongoose.Types.ObjectId.isValid(restaurantId)) {
            const restaurant = await Restaurant.findById(restaurantId);

            if (restaurant) {
                if (!restaurant.categorias.includes(nombre)) {
                    const category = await new Category(categoryData).save();
                    console.log('Categoría guardada con el ID:', category._id);

                    restaurant.categorias.push(nombre);
                    await restaurant.save();

                    return { categoryId: category._id, restaurantId, nombre };
                } else {
                    throw new Error('La categoría ya existe en el restaurante');
                }
            } else {
                throw new Error('Restaurante no encontrado');
            }
        } else {
            throw new Error('ID de restaurante no es válido');
        }
    } catch (error) {
        console.error('Error al agregar categoría:', error);
        throw error;
    }
}

// Obtener una categoría por ID
async function getCategoryById(id) {
    try {
        const categoryDoc = await firestoreAdmin.collection('Categories').doc(id).get();

        if (!categoryDoc.exists) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        return { id: categoryDoc.id, ...categoryDoc.data() };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Actualizar una categoría
async function updateCategory(id, updatedCategoryData) {
    try {
        const categoryRef = firestoreAdmin.collection('Categories').doc(id);
        const categoryDoc = await categoryRef.get();

        if (!categoryDoc.exists) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        // Actualizamos los datos de la categoría
        await categoryRef.update(updatedCategoryData);
        return { id, ...updatedCategoryData };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Eliminar una categoría
async function deleteCategory(id) {
    try {
        const categoryRef = firestoreAdmin.collection('Categories').doc(id);
        const categoryDoc = await categoryRef.get();

        if (!categoryDoc.exists) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }

        await categoryRef.delete();
        return { message: `Categoría con ID ${id} eliminada exitosamente` };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    getCategoriesWithPagination,
    countCategories,
    saveCategory,
};
