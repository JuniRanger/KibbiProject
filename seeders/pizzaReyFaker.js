import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import Restaurant from '../Models/RestaurantModel.js';
import Category from '../Models/CategoryModel.js';
import Product from '../Models/ProductModel.js';
import dotenv from 'dotenv';

dotenv.config();

const createPizzaReyProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // ID del restaurante existente
        const RESTAURANT_ID = '67a230417ad10bd383474ad2';
        
        // Verificar que existe el restaurante
        const existingRestaurant = await Restaurant.findById(RESTAURANT_ID);
        if (!existingRestaurant) {
            throw new Error('El restaurante no existe en la base de datos');
        }

        // Crear categorías específicas para Pizza el Rey
        const categories = [
            { nombre: "Pizzas Clásicas", restaurantId: RESTAURANT_ID },
            { nombre: "Pizzas Especiales", restaurantId: RESTAURANT_ID },
            { nombre: "Bebidas", restaurantId: RESTAURANT_ID },
            { nombre: "Postres", restaurantId: RESTAURANT_ID }
        ];

        const createdCategories = await Category.insertMany(categories);

        // Actualizar el restaurante con las nuevas categorías
        await Restaurant.findByIdAndUpdate(
            RESTAURANT_ID,
            { $push: { categorias: { $each: createdCategories.map(c => c._id) } } }
        );

        // Productos para agregar
        const products = [
            // Pizzas Clásicas
            {
                nombre: "Pizza Margarita",
                precio: 199,
                descripcion: "Salsa de tomate, mozzarella fresca y albahaca",
                categoriaId: createdCategories[0]._id,
                nombreCategoria: "Pizzas Clásicas",
                restauranteId: RESTAURANT_ID,
                imagenes: [faker.image.urlLoremFlickr({ category: 'pizza' })]
            },
            {
                nombre: "Pizza Pepperoni",
                precio: 219,
                descripcion: "Pepperoni y queso mozzarella",
                categoriaId: createdCategories[0]._id,
                nombreCategoria: "Pizzas Clásicas",
                restauranteId: RESTAURANT_ID,
                imagenes: [faker.image.urlLoremFlickr({ category: 'pepperoni' })]
            },
            
            // Pizzas Especiales
            {
                nombre: "Pizza Hawaiana Rey",
                precio: 249,
                descripcion: "Jamón, piña y queso manchego",
                categoriaId: createdCategories[1]._id,
                nombreCategoria: "Pizzas Especiales",
                restauranteId: RESTAURANT_ID,
                imagenes: [faker.image.urlLoremFlickr({ category: 'hawaianpizza' })]
            },

            // Bebidas
            {
                nombre: "Refresco 600ml",
                precio: 35,
                categoriaId: createdCategories[2]._id,
                nombreCategoria: "Bebidas",
                restauranteId: RESTAURANT_ID,
                imagenes: [faker.image.urlLoremFlickr({ category: 'soda' })]
            },

            // Postres
            {
                nombre: "Tiramisú Italiano",
                precio: 89,
                descripcion: "Postre clásico con café y mascarpone",
                categoriaId: createdCategories[3]._id,
                nombreCategoria: "Postres",
                restauranteId: RESTAURANT_ID,
                imagenes: [faker.image.urlLoremFlickr({ category: 'tiramisu' })]
            }
        ];

        await Product.insertMany(products);
        console.log(`✅ 5 productos agregados al restaurante ${RESTAURANT_ID}`);
        process.exit(0);
        
    } catch (error) {
        console.error('Error en el faker:', error);
        process.exit(1);
    }
};

createPizzaReyProducts(); 