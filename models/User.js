const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: [true, 'Mot de passe requis'],
        minlength: 6
    },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },

    // 👉 NOUVEAU : Rôles marketplace
    roles: [{
        type: String,
        enum: ['client', 'vendor', 'provider', 'admin'],
        default: ['client']
    }],

    // 👉 NOUVEAU : Infos pro (vendeurs/prestataires)
    companyName: { type: String },
    siret: {
        type: String,
        match: [/^[0-9]{14}$/, 'SIRET invalide'],
        unique: true
    },
    address: String,
    city: String,
    postalCode: String,
    zoneIntervention: [String], // ['Paris', '92', '93']
    verified: { type: Boolean, default: false },

    // Anciens champs (tu les gardes)
    isAdmin: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Hash password avant sauvegarde
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);
