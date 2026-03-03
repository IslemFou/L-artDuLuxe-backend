const express = require('express');
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getMyServices
} = require('../controllers/serviceController');


const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('provider'), createService);
router.put('/:id', authorize('provider'), updateService);
router.delete('/:id', authorize('provider'), deleteService);
router.get('/my-services', authorize('provider'), getMyServices);

module.exports = router;