# Complaint & Fraud Management Service

A REST API service for managing customer complaints and fraud reports built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Complaint Management**: Create, read, update complaints with categorization and priority levels
- **Fraud Reporting**: Handle fraud reports with severity levels and investigation tracking
- **Phone Number Lookup**: Query complaints and fraud reports by phone number
- **Status Tracking**: Track complaint and fraud report statuses through their lifecycle
- **Pagination**: Efficient data retrieval with pagination support
- **Validation**: Comprehensive input validation using Joi
- **Security**: Rate limiting, CORS, and security headers with Helmet

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit
- **Development**: ts-node-dev for hot reloading

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd complaint-fraud-service
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/complaint-fraud-db
PORT=3000
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check

#### GET /health
Check if the service is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Complaint & Fraud Management Service"
}
```

**cURL:**
```bash
curl -X GET http://localhost:3000/health
```

---

## Complaint Management

### Create Complaint

#### POST /api/complaints
Create a new customer complaint.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "category": "BILLING",
  "priority": "HIGH",
  "subject": "Incorrect billing amount",
  "description": "I was charged twice for the same service this month."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-A1B2C3D4",
    "phoneNumber": "+1234567890",
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "category": "BILLING",
    "priority": "HIGH",
    "status": "OPEN",
    "subject": "Incorrect billing amount",
    "description": "I was charged twice for the same service this month.",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Complaint created successfully"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "category": "BILLING",
    "priority": "HIGH",
    "subject": "Incorrect billing amount",
    "description": "I was charged twice for the same service this month."
  }'
```

### Get Complaint by ID

#### GET /api/complaints/:complaintId
Retrieve a specific complaint by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-A1B2C3D4",
    "phoneNumber": "+1234567890",
    "customerName": "John Doe",
    "status": "OPEN",
    "category": "BILLING",
    "priority": "HIGH",
    "subject": "Incorrect billing amount",
    "description": "I was charged twice for the same service this month.",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:3000/api/complaints/COMP-A1B2C3D4
```

### Get Complaints by Phone Number

#### GET /api/complaints/phone/:phoneNumber
Retrieve all complaints for a specific phone number.

**Query Parameters:**
- `status` (optional): Filter by status (OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED)
- `limit` (optional): Number of results per page (default: 10)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "complaintId": "COMP-A1B2C3D4",
      "phoneNumber": "+1234567890",
      "customerName": "John Doe",
      "status": "OPEN",
      "category": "BILLING",
      "priority": "HIGH",
      "subject": "Incorrect billing amount",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/complaints/phone/+1234567890?status=OPEN&limit=5"
```

### Update Complaint

#### PUT /api/complaints/:complaintId
Update an existing complaint.

**Request Body:**
```json
{
  "status": "RESOLVED",
  "assignedTo": "support-agent-123",
  "resolution": "Billing error corrected and refund processed."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-A1B2C3D4",
    "status": "RESOLVED",
    "assignedTo": "support-agent-123",
    "resolution": "Billing error corrected and refund processed.",
    "resolvedAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Complaint updated successfully"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/complaints/COMP-A1B2C3D4 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RESOLVED",
    "assignedTo": "support-agent-123",
    "resolution": "Billing error corrected and refund processed."
  }'
```

### Get All Complaints

#### GET /api/complaints
Retrieve all complaints with filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status
- `category` (optional): Filter by category (SERVICE, BILLING, TECHNICAL, PRODUCT, OTHER)
- `priority` (optional): Filter by priority (LOW, MEDIUM, HIGH, CRITICAL)
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Results to skip (default: 0)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order - asc/desc (default: desc)

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/complaints?category=BILLING&priority=HIGH&limit=10"
```

---

## Fraud Management

### Create Fraud Report

#### POST /api/fraud
Create a new fraud report.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "customerName": "Jane Smith",
  "email": "jane.smith@example.com",
  "fraudType": "UNAUTHORIZED_TRANSACTION",
  "severity": "HIGH",
  "description": "Unauthorized transactions on my account totaling $500",
  "transactionIds": ["TXN123456", "TXN123457"],
  "amountInvolved": 500.00,
  "currency": "USD",
  "incidentDate": "2024-01-14T15:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fraudId": "FRAUD-X1Y2Z3W4",
    "phoneNumber": "+1234567890",
    "customerName": "Jane Smith",
    "fraudType": "UNAUTHORIZED_TRANSACTION",
    "severity": "HIGH",
    "status": "REPORTED",
    "description": "Unauthorized transactions on my account totaling $500",
    "amountInvolved": 500.00,
    "currency": "USD",
    "incidentDate": "2024-01-14T15:30:00.000Z",
    "reportedDate": "2024-01-15T10:30:00.000Z"
  },
  "message": "Fraud report created successfully"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/fraud \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "customerName": "Jane Smith",
    "email": "jane.smith@example.com",
    "fraudType": "UNAUTHORIZED_TRANSACTION",
    "severity": "HIGH",
    "description": "Unauthorized transactions on my account totaling $500",
    "transactionIds": ["TXN123456", "TXN123457"],
    "amountInvolved": 500.00,
    "currency": "USD",
    "incidentDate": "2024-01-14T15:30:00.000Z"
  }'
```

### Get Fraud Report by ID

#### GET /api/fraud/:fraudId
Retrieve a specific fraud report by its ID.

**cURL:**
```bash
curl -X GET http://localhost:3000/api/fraud/FRAUD-X1Y2Z3W4
```

### Get Fraud Reports by Phone Number

#### GET /api/fraud/phone/:phoneNumber
Retrieve all fraud reports for a specific phone number.

**Query Parameters:**
- `status` (optional): Filter by status (REPORTED, UNDER_INVESTIGATION, VERIFIED, RESOLVED, DISMISSED)
- `fraudType` (optional): Filter by fraud type
- `limit` (optional): Results per page (default: 10)
- `offset` (optional): Results to skip (default: 0)

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/fraud/phone/+1234567890?status=REPORTED"
```

### Update Fraud Report

#### PUT /api/fraud/:fraudId
Update an existing fraud report.

**Request Body:**
```json
{
  "status": "UNDER_INVESTIGATION",
  "investigatorId": "INV-001",
  "investigationNotes": "Initial investigation started. Reviewing transaction logs."
}
```

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/fraud/FRAUD-X1Y2Z3W4 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "UNDER_INVESTIGATION",
    "investigatorId": "INV-001",
    "investigationNotes": "Initial investigation started. Reviewing transaction logs."
  }'
```

### Get All Fraud Reports

#### GET /api/fraud
Retrieve all fraud reports with filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status
- `fraudType` (optional): Filter by fraud type (IDENTITY_THEFT, UNAUTHORIZED_TRANSACTION, ACCOUNT_TAKEOVER, PHISHING, OTHER)
- `severity` (optional): Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Results to skip (default: 0)
- `sortBy` (optional): Sort field (default: reportedDate)
- `sortOrder` (optional): Sort order - asc/desc (default: desc)

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/fraud?fraudType=UNAUTHORIZED_TRANSACTION&severity=HIGH"
```

### Get Fraud Statistics

#### GET /api/fraud/stats
Get aggregated fraud statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "totalAmount": 75000.00,
    "byStatus": [
      { "_id": "REPORTED", "count": 45 },
      { "_id": "UNDER_INVESTIGATION", "count": 30 },
      { "_id": "RESOLVED", "count": 75 }
    ],
    "bySeverity": [
      { "_id": "LOW", "count": 20 },
      { "_id": "MEDIUM", "count": 50 },
      { "_id": "HIGH", "count": 60 },
      { "_id": "CRITICAL", "count": 20 }
    ]
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:3000/api/fraud/stats
```

## Data Models

### Complaint Categories
- `SERVICE`: Service-related issues
- `BILLING`: Billing and payment issues
- `TECHNICAL`: Technical problems
- `PRODUCT`: Product-related complaints
- `OTHER`: Other types of complaints

### Complaint Priorities
- `LOW`: Low priority
- `MEDIUM`: Medium priority (default)
- `HIGH`: High priority
- `CRITICAL`: Critical priority

### Complaint Statuses
- `OPEN`: Newly created complaint (default)
- `IN_PROGRESS`: Being worked on
- `RESOLVED`: Issue resolved
- `CLOSED`: Complaint closed
- `CANCELLED`: Complaint cancelled

### Fraud Types
- `IDENTITY_THEFT`: Identity theft cases
- `UNAUTHORIZED_TRANSACTION`: Unauthorized transactions
- `ACCOUNT_TAKEOVER`: Account takeover incidents
- `PHISHING`: Phishing attempts
- `OTHER`: Other fraud types

### Fraud Severities
- `LOW`: Low severity
- `MEDIUM`: Medium severity (default)
- `HIGH`: High severity
- `CRITICAL`: Critical severity

### Fraud Statuses
- `REPORTED`: Newly reported (default)
- `UNDER_INVESTIGATION`: Under investigation
- `VERIFIED`: Fraud verified
- `RESOLVED`: Case resolved
- `DISMISSED`: Case dismissed

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "details": ["Detailed error messages"],
  "message": "Error description"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the TypeScript project
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # Route definitions
├── validators/      # Input validation schemas
└── index.ts         # Application entry point
```

## Deployment

The service is configured for AWS Lambda deployment using `serverless-http`. The `handler` export in `src/index.ts` provides the Lambda function entry point.

For traditional server deployment, the service will run on the port specified in the `PORT` environment variable (default: 3000).