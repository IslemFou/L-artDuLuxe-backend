const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    // Prestataire qui propose le service
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Nom du service
    title: {
        type: String,
        required: [true, 'Titre du service requis'],
        maxlength: 200
    },

    // Description détaillée
    description: {
        type: String,
        required: [true, 'Description requise'],
        maxlength: 2000
    },

    // Catégorie de travaux / déco
    category: {
        type: String,
        enum: [
            'peinture',
            'renovation_complete',
            'cuisine',
            'salle_de_bain',
            'menuiserie',
            'electricite',
            'plomberie',
            'amenagement_interieur',
            'decoration',
            'montage_meubles',
            'autre'
        ],
        required: true
    },

    // Type de logement / pièce ciblé
    roomTypes: [{
        type: String,
        enum: [
            'salon',
            'chambre',
            'cuisine',
            'salle_bain',
            'bureau',
            'exterieur',
            'appartement',
            'maison'
        ]
    }],

    // Zone géographique
    city: {
        type: String,
        required: true
    },
    postalCode: String,
    zones: [String], // ex: ['Paris', '92', '93']

    // Tarification
    pricingType: {
        type: String,
        enum: ['forfait', 'horaire', 'sur_devis'],
        default: 'sur_devis'
    },
    priceFrom: { type: Number, min: 0 }, // prix indicatif
    priceUnit: {
        type: String,
        enum: ['prestation', 'heure', 'm2'],
        default: 'prestation'
    },

    // Durée indicative
    duration: String, // ex: "1 journée", "2-3 jours"

    // Média / portfolio
    images: [String], // URLs Cloudinary
    videoUrl: String,

    // Expérience & tags
    experienceYears: { type: Number, min: 0 },
    tags: [String], // ex: ['scandinave', 'bois', 'eco', 'minimaliste']

    // Notes & statut
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

// Index utiles pour la recherche
serviceSchema.index({ city: 1, category: 1 });
serviceSchema.index({ provider: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
