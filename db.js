const mongoose = require('mongoose');

const db = () => {

    mongoose.set('strictQuery', true);

    const dbUrl = process.env.DB_URL;

    mongoose.connect(dbUrl)

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('Connected to the database');
    });

}

module.exports = db;