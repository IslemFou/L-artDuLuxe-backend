const Service = require('../models/Service.js');
// User model is not used in this controller (was causing module resolution errors),
// so the import has been removed. Add it back only if needed in the future.

// @desc    Récupérer tous les services (recherche prestataires)
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
    try {
        const {
            category,
            city,
            roomType,
            prix_max,
            rating_min = 0,
            limit = 12,
            page = 1
        } = req.query; // Obtenir les paramètres de la requête
        let query = { isActive: true }; // Créer un objet de requête vide
        // Filtres par catégorie de traveaux
        if (category) query.category = category;
        // Filtres par pièce / type de logement
        if (roomType) query.roomType = roomType;
        // Filtres géo
        if (city) query.city = { $regex: city, $options: 'i' };

        //Filtres budget et note
        if (prix_max) query.priceForm = { $lte: prix_max };
        if (prix_min) query.priceForm = {
            ...query.priceForm,
            $gte: parseInt(prix_min)
        };

        //Filtres note
        if (rating_min > 0) query.rating = { $gte: parseFloat(rating_min) };

        const services = await Service.find(query).populate('provider', 'companyName city rating').limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 });

        const count = await Service.countDocuments(query);

        res.json({
            success: true,
            count,
            services,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// @desc    Récupérer service par ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('provider', 'companyName city rating');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service introuvable'
            });
        }
        res.json({
            success: true,
            service
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// @desc    Créer service (SEULS LES PRESTATAIRES)
// @route   POST /api/services
// @access  Privé - Provider uniquement
exports.createService = async (req, res) => {
    try {
        //auto-assigner le prestataire connecté
        req.body.provider = req.user._id;

        //vérifier rôle provider
        if (!req.user.roles.includes('provider')) {
            return res.status(403).json({
                success: false,
                message: 'Seuls les prestataires peuvent créer des services'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Modifier service (SEULS LE PROPRIÉTAIRE)
// @route   PUT /api/services/:id
// @access  Privé - Provider uniquement
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        // vérifier 
        if (!service) {
            return res.status(404).json({
                sucess: false,
                message: 'Service introuvable'
            });
        }
        //vérifier rôle provider
        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé à modifier ce service'
            });
        }

        // Modifier le service
        const updateService = await Service.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true, runValidators: true })
            .populate('provider', 'companyName city rating');

        res.json({
            success: true,
            message: 'Service modifié',
            updateService
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Supprimer service (SEULS LE PROPRIÉTAIRE)
// @route   DELETE /api/services/:id
// @access  Privé - Provider uniquement

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service introuvable'
            });
        }
        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé à supprimer ce service'
            });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Service supprimé'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// @desc    Mes services (dashboard prestataire)
// @route   GET /api/services/my-services
// @access  Privé - Provider uniquement

exports.getMyServices = async (req, res) => {
    try {
        const services = await Service.find({
            provider: req.user._id
        }).populate('provider', 'companyName city rating')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            services
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
