import { Router } from 'express';
import { FraudController } from '../controllers/fraud.controller';

const router = Router();

// Create a new fraud report
router.post('/', FraudController.createFraud);

// Get fraud report by ID
router.get('/:fraudId', FraudController.getFraudById);

// Get fraud reports by phone number
router.get('/phone/:phoneNumber', FraudController.getFraudsByPhone);

// Update fraud report
router.put('/:fraudId', FraudController.updateFraud);

// Get fraud statistics
router.get('/stats', FraudController.getFraudStats);

// Get all fraud reports with filtering (this should be last to avoid conflicts)
router.get('/', FraudController.getAllFrauds);

export default router;