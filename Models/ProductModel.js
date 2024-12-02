import mongoose from 'mongoose';
import Category from './CategoryModel.js';

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            trim: true,
            maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
        },
        precio: {
            type: Number,
            required: [true, 'El precio del producto es obligatorio'],
            min: [0, 'El precio no puede ser negativo'],
        },
        categoriaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categories',
            required: true
        },
        nombreCategoria: { // Agregar el campo de nombreCategoria
            type: String,
            required: true, // Esto hace que el nombre se guarde en la base de datos
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede superar los 500 caracteres'],
        },
        disponibilidad: {
            type: Boolean,
            default: true,
        },
        imagenes: {
            type: [String],
            validate: {
                validator: (array) => array.length <= 5,
                message: 'El producto no puede tener más de 5 imágenes',
            },
            default: [],
        },
        restauranteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true, 'El ID del restaurante es obligatorio'],
        },
    },
    {
        timestamps: true, // createdAt y updatedAt automáticos
    }
);

// Middleware para actualizar nombreCategoria cuando se actualice el producto
productSchema.pre('save', async function(next) {
    if (this.isModified('categoriaId')) {
        const category = await Category.findById(this.categoriaId);
        if (category) {
            this.nombreCategoria = category.nombre;
        }
    }
    next();
});

// Modelo
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
