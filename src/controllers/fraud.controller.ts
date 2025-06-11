import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Fraud, IFraud } from '../models/fraud.model';
import { validateFraud, validateFraudUpdate } from '../validators/fraud.validator';

export class FraudController {
  // Create a new fraud report
  static async createFraud(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateFraud(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const fraudData = {
        ...value,
        fraudId: `FRAUD-${uuidv4().substring(0, 8).toUpperCase()}`
      };

      const fraud = new Fraud(fraudData);
      await fraud.save();

      res.status(201).json({
        success: true,
        data: fraud,
        message: 'Fraud report created successfully'
      });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          error: 'Duplicate fraud ID'
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

  // Get fraud report by ID
  static async getFraudById(req: Request, res: Response): Promise<void> {
    try {
      const { fraudId } = req.params;
      
      const fraud = await Fraud.findOne({ fraudId });
      if (!fraud) {
        res.status(404).json({
          success: false,
          error: 'Fraud report not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: fraud
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Get fraud reports by phone number
  static async getFraudsByPhone(req: Request, res: Response): Promise<void> {
    try {
      const { phoneNumber } = req.params;
      const { status, fraudType, limit = 10, offset = 0 } = req.query;

      const query: any = { phoneNumber };
      if (status) query.status = status;
      if (fraudType) query.fraudType = fraudType;

      const frauds = await Fraud.find(query)
        .sort({ reportedDate: -1 })
        .limit(Number(limit))
        .skip(Number(offset));

      const total = await Fraud.countDocuments(query);

      res.status(200).json({
        success: true,
        data: frauds,
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

  // Update fraud report
  static async updateFraud(req: Request, res: Response): Promise<void> {
    try {
      const { fraudId } = req.params;
      const { error, value } = validateFraudUpdate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const updateData = { ...value };
      if (value.status === 'RESOLVED' || value.status === 'DISMISSED') {
        updateData.resolvedAt = new Date();
      }

      const fraud = await Fraud.findOneAndUpdate(
        { fraudId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!fraud) {
        res.status(404).json({
          success: false,
          error: 'Fraud report not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: fraud,
        message: 'Fraud report updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Get all fraud reports with filtering
  static async getAllFrauds(req: Request, res: Response): Promise<void> {
    try {
      const { 
        status, 
        fraudType, 
        severity, 
        limit = 20, 
        offset = 0,
        sortBy = 'reportedDate',
        sortOrder = 'desc'
      } = req.query;

      const query: any = {};
      if (status) query.status = status;
      if (fraudType) query.fraudType = fraudType;
      if (severity) query.severity = severity;

      const sortOptions: any = {};
      sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

      const frauds = await Fraud.find(query)
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(Number(offset));

      const total = await Fraud.countDocuments(query);

      res.status(200).json({
        success: true,
        data: frauds,
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

  // Get fraud statistics
  static async getFraudStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await Fraud.aggregate([
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            byStatus: {
              $push: {
                status: '$status',
                count: 1
              }
            },
            bySeverity: {
              $push: {
                severity: '$severity',
                count: 1
              }
            },
            totalAmount: { $sum: '$amountInvolved' }
          }
        }
      ]);

      const statusStats = await Fraud.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const severityStats = await Fraud.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          total: stats[0]?.totalReports || 0,
          totalAmount: stats[0]?.totalAmount || 0,
          byStatus: statusStats,
          bySeverity: severityStats
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