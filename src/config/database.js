const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://athithiyanm87:jMjO6ix2hJCqFBMv@cluster0.rqlm7wk.mongodb.net/devTinner');
}

module.exports = connectDB;