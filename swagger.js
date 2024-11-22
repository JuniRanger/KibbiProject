import swaggerJSDoc from "swagger-jsdoc";
import path from 'path'

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "KibbiAPI",
            version: "1.0.0",
            description: "Documentación y testeo de las rutas de KibbiAPI ",
            contact: {
                name: "Jonathan Melendez"
            },
            servers: [
                {
                    url: 'https://kibbiapi.onrender.com',
                    description: 'render server'
                },
                {
                    url: 'http://localhost:3000/api/',
                    description: 'local server'
                }
            ]
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Introduce el token JWT para acceder a las rutas protegidas.'
                }
            }
        }
    },
    apis: ['./Routes/*.js'], // files containing annotations as above
};

const specs = swaggerJSDoc(options);
export default specs;