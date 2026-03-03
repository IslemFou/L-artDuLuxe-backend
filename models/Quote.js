const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Titre devis requis'],
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    amount: {
        type: Number,
        required: [true, 'Montant requis'],
        min: 0
    },
    duration: String, // "3 semaines"
    deliverables: [String], // ["Peinture murs", "Pose parquet"]
    images: [String],

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Index pour performances
quoteSchema.index({ project: 1, status: 1 });
quoteSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model('Quote', quoteSchema);
