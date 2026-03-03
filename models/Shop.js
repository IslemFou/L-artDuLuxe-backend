const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Nom boutique requis'],
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    logo: String, // URL Cloudinary
    coverImage: String,
    categories: [{
        type: String,
        enum: ['salon', 'chambre', 'cuisine', 'bureau', 'deco', 'exterieur']
    }],
    city: {
        type: String,
        required: true
    },
    delivery: {
        zones: [String],
        fees: Number, // € fixe
        freeOver: Number // livraison gratuite > X€
    },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);
