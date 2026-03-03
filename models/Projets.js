const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Titre projet requis'],
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Description requise'],
        maxlength: 2000
    },
    // 👉 Spécifique travaux/déco
    roomType: {
        type: String,
        enum: ['salon', 'chambre', 'cuisine', 'salle_bain', 'bureau', 'exterieur', 'autre'],
        required: true
    },
    surface: { type: Number, min: 1 }, // m²
    style: {
        type: [String],
        enum: ['moderne', 'scandinave', 'industriel', 'classique', 'bohème', 'minimaliste']
    },
    budgetMin: { type: Number, min: 0 },
    budgetMax: { type: Number, min: 0 },

    // Localisation
    address: String,
    city: String,
    postalCode: String,
    lat: Number,
    lng: Number,

    images: [String], // URLs Cloudinary

    status: {
        type: String,
        enum: ['ouvert', 'en_cours', 'devis_recus', 'en_travaux', 'termine', 'annule'],
        default: 'ouvert'
    },

    quotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
