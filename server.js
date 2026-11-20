
const express = require('express');
require ('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const connectDB = require('./config/db.js');
const app = express();
const {notFound, errorHandler} = require('./middleware/error.js');

const authRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the E-Commerce API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);



app.use(notFound);
app.use(errorHandler);




connectDB().then(() => {app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
})
});