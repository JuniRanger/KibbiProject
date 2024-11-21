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
        // creacion de referencias de los productos de firestore
        const productRef = productIds.map(productId => firestoreAdmin.collection('Products').doc(productId))

        //obteniendo los productos
        const productDocs = await firestoreAdmin.getAll(...productRef)

        //guardando cada producto en el array products
        const products = []
        productDocs.forEach(doc => {
            if (doc.exists){
                products.push({ id: doc.id, ...doc.data() })
            }
        })

        if(products.length !== productIds.length){
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