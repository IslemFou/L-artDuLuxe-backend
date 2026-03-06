const User = require('../models/User');
// @desc    Récupérer tous les utilisateurs (admin uniquement)
// @route   GET /api/users
// @access  Privé - Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('shops')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Récupérer utilisateur par ID
// @route   GET /api/users/:id
// @access  Privé - Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Modifier utilisateur (admin)
// @route   PUT /api/users/:id
// @access  Privé - Admin
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req, body,
            {
                new: true, runValidators: true
            }).select('-password');
        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vérifier prestataire/vendeur (admin)
// @route   PUT /api/users/:id/verify
// @access  Privé - Admin
exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { verified: true },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: '${user.companyName} vérifié',
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Supprimer utilisateur (admin)
// @route   DELETE /api/users/:id
// @access  Privé - Admin
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req, params.id);
        res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
        es.status(500).json({ message: error.message });
    }
}