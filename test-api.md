# API Testing Guide

## Setup Instructions

1. **Update your database password** in `.env` file:
   ```
   MONGODB_URI=mongodb+srv://Insurance_samadan_db:YOUR_ACTUAL_PASSWORD@cluster0.mttrr4c.mongodb.net/Insurance_samadan_db?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **Start the server**:
   ```bash
   npm run dev
   ```

3. **Test the connection**:
   ```bash
   curl http://localhost:3000/health
   ```

## Test Commands (Copy & Paste Ready)

### 1. Create a Complaint
```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "customerName": "Rajesh Kumar",
    "email": "rajesh.kumar@example.com",
    "category": "BILLING",
    "priority": "HIGH",
    "subject": "Premium payment issue",
    "description": "Unable to pay premium online. Getting error message during payment."
  }'
```

### 2. Create a Fraud Report
```bash
curl -X POST http://localhost:3000/api/fraud \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "customerName": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "fraudType": "UNAUTHORIZED_TRANSACTION",
    "severity": "HIGH",
    "description": "Unauthorized claim settlement of Rs. 50,000 processed without my knowledge",
    "transactionIds": ["TXN123456", "TXN123457"],
    "amountInvolved": 50000,
    "currency": "INR",
    "incidentDate": "2024-01-14T15:30:00.000Z"
  }'
```

### 3. Get All Complaints
```bash
curl -X GET "http://localhost:3000/api/complaints?limit=5"
```

### 4. Get All Fraud Reports
```bash
curl -X GET "http://localhost:3000/api/fraud?limit=5"
```

### 5. Get Complaints by Phone Number
```bash
curl -X GET "http://localhost:3000/api/complaints/phone/+919876543210"
```

### 6. Get Fraud Reports by Phone Number
```bash
curl -X GET "http://localhost:3000/api/fraud/phone/+919876543210"
```

### 7. Update Complaint Status
```bash
# First, get a complaint ID from step 3, then use it here
curl -X PUT http://localhost:3000/api/complaints/COMP-XXXXXXXX \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RESOLVED",
    "assignedTo": "agent-001",
    "resolution": "Payment gateway issue resolved. Customer can now make payments."
  }'
```

### 8. Update Fraud Report
```bash
# First, get a fraud ID from step 4, then use it here
curl -X PUT http://localhost:3000/api/fraud/FRAUD-XXXXXXXX \
  -H "Content-Type: application/json" \
  -d '{
    "status": "UNDER_INVESTIGATION",
    "investigatorId": "INV-001",
    "investigationNotes": "Started investigation. Reviewing transaction logs and customer verification."
  }'
```

### 9. Get Fraud Statistics
```bash
curl -X GET http://localhost:3000/api/fraud/stats
```

## Expected Database Collections

After running these tests, you should see:
- **complaints** collection with complaint documents
- **fraud** collection with fraud report documents

## Verification Steps

1. **Check MongoDB Atlas**: Log into your MongoDB Atlas dashboard and verify data is being stored in:
   - Database: `Insurance_samadan_db`
   - Collections: `complaints` and `fraud`

2. **Test Data Flow**:
   - Create → Verify data appears in MongoDB
   - Update → Verify changes are reflected
   - Query → Verify filtering and pagination work

## Common Issues & Solutions

1. **Connection Error**: Make sure to replace `<db_password>` with your actual password
2. **Network Access**: Ensure your IP is whitelisted in MongoDB Atlas
3. **Database User**: Verify the database user has read/write permissions

## Sample Response Format

**Complaint Creation Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-A1B2C3D4",
    "phoneNumber": "+919876543210",
    "customerName": "Rajesh Kumar",
    "status": "OPEN",
    "category": "BILLING",
    "priority": "HIGH",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Complaint created successfully"
}
```