const swaggerAutogen = require('swagger-autogen')()

output = './docs.json'
endpoints = ['./app.js']

const doc = {
    info: {
        description: "Uma API para gernciar listas de jogos"
    },
}

swaggerAutogen(output, endpoints, doc)