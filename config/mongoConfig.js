import mongoose from "mongoose";

const mongooseConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Conexión a mongo exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
}

export default mongooseConnect