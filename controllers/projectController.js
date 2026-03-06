const Project = require('../models/Projets');
const Quote = require('../models/Quote');
const User = require('../models/User');

// @desc    Créer projet (client demande travaux)
// @route   POST /api/projects
// @access  Privé - Client
/*
Cette fonction permet à un client connecté de créer une nouvelle demande de projet/travaux. L'API s'assure que le client est bien l'utilisateur connecté.
*/
exports.createProject = async (req, res) => {
    try {
        req.body.client = req.user._id;
        //Assigne automatiquement l'ID de l'utilisateur connecté comme client du projet. Cela garantit qu'un client ne peut créer un projet que pour lui-même.
        const project = await Project.create(req.body);
        //Crée un nouveau projet en base de données avec les données envoyées dans le corps de la requête (titre, description, etc.).

        res.status(201).json({ success: true, project }); //Retourne la réponse avec le statut 201 (Created) et les détails du projet créé.

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Récupérer mes projets (client)
// @route   GET /api/projects/my-projects
// @access  Privé
exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ client: req.user._id })
            .populate({
                path: 'quotes',
                populate: { path: 'provider', select: 'companyName rating' }
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Projets ouverts (prestataires)
// @route   GET /api/projects
// @access  Public / Privé - Provider
exports.getOpenProjects = async (req, res) => {
    try {
        const {
            city, category, limit = 20
        } = req.query;

        let query = { status: 'ouvert' };
        if (city) query.city = { $regex: city, $options: 'i' };

        const projects = await Project.find(query)
            .populate('client', 'nom prenom')
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Mettre à jour statut projet
// @route   PUT /api/projects/:id
// @access  Privé
exports.updateProjectStatus = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Projet introuvable' });
        }

        // Authorization check: Only the project's client can update it.
        if (project.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Action non autorisée.' });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status }, // Only allow updating the status
            { new: true, runValidators: true }
        ).populate('client', 'nom prenom');

        res.json({ success: true, project: updatedProject });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};