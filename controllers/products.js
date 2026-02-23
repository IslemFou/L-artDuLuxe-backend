const { request } = require('http');
const Product = require('../models/product');
//GET tous les produits par paramètres

// GET All products
exports.getProducts = async (req, res) => {
    try {
        const { categorie, prix_max } = req.query; // Obtenir les paramètres de la requête 
        let query = {}; // Créer un objet de requête vide
        if (categorie) query.categorie = categorie; // Ajouter la categorie au query
        if (prix_max) query.prix = { $lte: prix_max };
        if (eco) query.eco = eco;

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// GET product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: "Produit introuvable" });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST créer un produit
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// PUT modifier un produit
exports.updateProduct = async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateProduct) {
            return res.status(404).json({ success: false, error: "Produit introuvable" });
        }
        res.json({ success: true, product: updateProduct });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// DELETE supprimer un produit
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ sucess: false, error: 'Produit introuvable' });
        }
        res.json({ success: true, message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ sucess: false, error: error.message });
    }
}
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}

