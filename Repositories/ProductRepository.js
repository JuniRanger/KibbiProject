import Product from "../Models/ProductModel.js";
import Category from '../Models/CategoryModel.js'

async function saveProduct(product) {
    try {
        const categoryId = product.categoriaId
        const categoryDoc = await Category.findById(categoryId)

        if(!categoryDoc){
            throw new Error("Categoria no encontrada");
        }

        const nombreCategoria = categoryDoc.nombre;
        delete product.CategoriaId

        const productWithCategoryName = {
            ...product,
            nombreCategoria,
        };

        const newProduct = new Product(productWithCategoryName);
        const savedProduct = await newProduct.save();

        return savedProduct
    } catch (error) {
        console.error(error.message)
        throw error
    }
}


async function getProductsById(productIds){
    try {
        const products = await Product.find({ _id: { $in: productIds } });

        if(!products.length) {
            throw new Error("Algunos productos no fueron encontrados");
        }

        return products
    } catch (error) {
        console.error(error)
    }
}


async function getProducts() {
    try {
        const querySnapshot = await firestoreAdmin.collection('Products').doc().get()
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        return products
    } catch (error) {
        console.error(error.message)
    }
}

export default {
    saveProduct,
    getProductsById,
    getProducts
}