import mongoose from 'mongoose';

// Definición del esquema de producto
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
            ref: 'Category',
            required: [true, 'La categoría es obligatoria'],
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

// Modelo
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
