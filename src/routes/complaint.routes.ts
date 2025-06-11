import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';

const router = Router();

// Create a new complaint
router.post('/', ComplaintController.createComplaint);

// Get complaint by ID
router.get('/:complaintId', ComplaintController.getComplaintById);

// Get complaints by phone number
router.get('/phone/:phoneNumber', ComplaintController.getComplaintsByPhone);

// Update complaint
router.put('/:complaintId', ComplaintController.updateComplaint);

// Get all complaints with filtering
router.get('/', ComplaintController.getAllComplaints);

export default router;