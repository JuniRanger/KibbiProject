import express from 'express';
import morgan from 'morgan';
import orderRoutes from './Routes/Order.Routes.js';
import authRoutes from './Routes/Auth.Routes.js';
import restaurantRoutes from './routes/Restaurant.Routes.js'
import categoryRoutes from './Routes/Category.Routes.js'
import productRoutes from './Routes/Product.Routes.js'
import bodyParser from './middlewares/bodyParser.js';
import dotenv from 'dotenv';
import CorsMiddleware from './middlewares/CorsMiddleware.js';
import verifyToken from './middlewares/authMiddleware.js';
import swaggerUI from 'swagger-ui-express';
import specs from './Config/swagger.js'
import mongooseConnect from './config/mongoConfig.js';

dotenv.config();
const app = express();

mongooseConnect();

app.use(CorsMiddleware)
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.jsonParser);
app.use(bodyParser.urlencodedParser);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api', authRoutes);
app.use('/api/orders', verifyToken, orderRoutes);
app.use('/api/restaurants', verifyToken, restaurantRoutes)
app.use('/api/categories', verifyToken, categoryRoutes)
app.use('/api/products', verifyToken, productRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Errror interno de servidor', error: err.message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`); 
});