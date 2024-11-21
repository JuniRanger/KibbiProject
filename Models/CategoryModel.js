import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId, // Relación con la colección Restaurant
            ref: 'Restaurant',
            required: true
        }
    },
    {
        timestamps: true // Agrega createdAt y updatedAt automáticamente
    }
);


const Category = mongoose.models.Categories || mongoose.model('Categories', CategorySchema);

export default Category;
