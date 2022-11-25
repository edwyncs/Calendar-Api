const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        mongoose.connect(process.env.DB_CNN);

        console.log('db online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos')
    }
}

module.exports = {
    dbConnection
}