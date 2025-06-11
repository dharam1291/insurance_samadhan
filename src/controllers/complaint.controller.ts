import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Complaint, IComplaint } from '../models/complaint.model';
import { validateComplaint, validateComplaintUpdate } from '../validators/complaint.validator';

export class ComplaintController {
  // Create a new complaint
  static async createComplaint(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateComplaint(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const complaintData = {
        ...value,
        complaintId: `COMP-${uuidv4().substring(0, 8).toUpperCase()}`
      };

      const complaint = new Complaint(complaintData);
      await complaint.save();

      res.status(201).json({
        success: true,
        data: complaint,
        message: 'Complaint created successfully'
      });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          error: 'Duplicate complaint ID'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Get complaint by ID
  static async getComplaintById(req: Request, res: Response): Promise<void> {
    try {
      const { complaintId } = req.params;
      
      const complaint = await Complaint.findOne({ complaintId });
      if (!complaint) {
        res.status(404).json({
          success: false,
          error: 'Complaint not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: complaint
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Get complaints by phone number
  static async getComplaintsByPhone(req: Request, res: Response): Promise<void> {
    try {
      const { phoneNumber } = req.params;
      const { status, limit = 10, offset = 0 } = req.query;

      const query: any = { phoneNumber };
      if (status) {
        query.status = status;
      }

      const complaints = await Complaint.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(offset));

      const total = await Complaint.countDocuments(query);

      res.status(200).json({
        success: true,
        data: complaints,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: total > Number(offset) + Number(limit)
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Update complaint status
  static async updateComplaint(req: Request, res: Response): Promise<void> {
    try {
      const { complaintId } = req.params;
      const { error, value } = validateComplaintUpdate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const updateData = { ...value };
      if (value.status === 'RESOLVED' || value.status === 'CLOSED') {
        updateData.resolvedAt = new Date();
      }

      const complaint = await Complaint.findOneAndUpdate(
        { complaintId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!complaint) {
        res.status(404).json({
          success: false,
          error: 'Complaint not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: complaint,
        message: 'Complaint updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Get all complaints with filtering
  static async getAllComplaints(req: Request, res: Response): Promise<void> {
    try {
      const { 
        status, 
        category, 
        priority, 
        limit = 20, 
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query: any = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (priority) query.priority = priority;

      const sortOptions: any = {};
      sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

      const complaints = await Complaint.find(query)
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(Number(offset));

      const total = await Complaint.countDocuments(query);

      res.status(200).json({
        success: true,
        data: complaints,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: total > Number(offset) + Number(limit)
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }
}