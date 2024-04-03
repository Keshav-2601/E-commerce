const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config({
  path: './config/.env'
});

const connectToDb = require('./config/db');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// enable files upload

app.use('/uploads', express.static('uploads'));


connectToDb();

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/product', require('./routes/productRoutes'));
app.use('/api/v1/cart', require('./routes/cartRoutes'));

app.listen(8000, () => {
  console.log("App is running");
});