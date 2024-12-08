// server.js
const fs = require('fs');
const express = require('express');
const knex = require('knex')(require('./knexfile'));
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const routes = require('./routes/routes');  // Import routes.js

dotenv.config();

const app = express();
const port = process.env.PORT || 20608;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Questionnaire API',
            version: '1.0.0',
            description: 'API for managing questionnaires and responses',
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    value: "Bearer <JWT token here>"
                }
            }
        }        
    },
    apis: ['./controllers/*.js'], // paths to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

fs.writeFileSync('swagger.json', JSON.stringify(swaggerDocs, null, 2));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(swaggerDocs, null, 2));
});
app.use('/', routes);  // All routes will be prefixed with '/api'


// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
