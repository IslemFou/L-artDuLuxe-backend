//Dependencies and variables declaration  
const express = require('express');
// express framework web Node.js (créer des APIs, routes, serveur HTTP, etc.)
const cors = require('cors');
// permet de partager des ressources entre plusieurs origines différentes, Autorise React (port 3000) et API Node.js (port 5000) à communiquer entre eux 
const mongoose = require('mongoose');
// Librairie de gestion de base de données NoSQL pour Node.js
const dotenv = require('dotenv');
// permet de charger des variables d'environnement depuis un fichier .env


//configuration dotenv variables d'environnement
dotenv.config(); // 

const app = express(); //création du server express 


// middleware
app.use(cors()); // Autorise React (port 3000) et API Node.js (port 5000) à communiquer entre eux
app.use(express.json()); // Transforme JSON des requêtes POST en objet JS 

//-------- Routes produits
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);  // Préfixe automatique !


//Mongo DB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/meublemaison')
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.log('❌ MongoDB', err));

// Modèle Produit Meuble
const productSchema = new mongoose.Schema({
    nom: String,
    prix: Number,
    categorie: String, // canapé, table, chaise
    image: String,
    stock: Number,
    eco: Boolean // éco-friendly
});

const Product = mongoose.model('Product', productSchema);


// Routes API
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend: http://localhost:${PORT}`));