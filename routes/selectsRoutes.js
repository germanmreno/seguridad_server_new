import express from 'express';
import {
  getEntities,
  getAdministrativeUnitsByEntity,
  getDirectionsByUnit,
  getAreasByParent,
} from '../controllers/selectControllers.js';

const router = express.Router();

// Group related routes
router.route('/entities').get(getEntities);

router
  .route('/administrative-units/:entityId')
  .get(getAdministrativeUnitsByEntity);

router.route('/directions/:unitId').get(getDirectionsByUnit);

router.route('/areas/:parentId').get(getAreasByParent);

export default router;

//EndPoints:
//GET /api/selects/entities
//GET /api/selects/administrative-units/:entityId
//GET /api/selects/directions/:unitId
// GET /api/selects/areas/:parentId?type=unit|direction
