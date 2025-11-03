# Spitly Database Schema Documentation
### 1. Users Collection

**Collection Name:** `users`

**Purpose:** Store user account information

**Schema:**
```javascript
{
  _id: ObjectId,
  email: String (required, unique, lowercase),
  name: String (required, 2-100 characters),
  avatar: String (URL, optional),
  phone: String (10-11 digits, optional),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  _destroy: Boolean (soft delete)
}
```

**Indexes:**
- `email`: Unique index for fast user lookup
- `createdAt`: Descending index for sorting

**Example:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "phihung@example.com",
  "name": "Phi Hùng",
  "avatar": "https://example.com/avatar.jpg",
  "phone": "0123456789",
  "createdAt": 1699000000000,
  "updatedAt": null,
  "_destroy": false
}
```

---

### 2. Bills Collection

**Collection Name:** `bills`

**Purpose:** Store bill/invoice information and track payments

**Schema:**
```javascript
{
  _id: ObjectId,
  billName: String (required, 1-200 characters),
  description: String (optional, max 500 characters),
  creatorId: String (required, user ObjectId),
  payerId: String (required, user ObjectId - person who paid upfront),
  totalAmount: Number (required, >= 0),
  paymentDate: Timestamp,
  splittingMethod: String (enum: 'equal' | 'item-based'),
  participants: [String] (array of user ObjectIds),
  items: [
    {
      name: String (required),
      amount: Number (required),
      allocatedTo: [String] (array of user ObjectIds)
    }
  ],
  paymentStatus: [
    {
      userId: String (user ObjectId),
      amountOwed: Number,
      isPaid: Boolean,
      paidDate: Timestamp
    }
  ],
  isSettled: Boolean (all participants paid),
  optedOutUsers: [String] (array of user ObjectIds),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  _destroy: Boolean
}
```

**Indexes:**
- `creatorId`: Index for bills created by user
- `payerId`: Index for bills paid by user
- `participants`: Index for bills user is part of
- `isSettled`: Index for filtering settled/unsettled bills
- `createdAt`: Descending index for sorting
- `paymentDate`: Descending index for sorting

**Note:** When creating bills with emails, the system will automatically find or create users by email. If a user doesn't exist, it will be created with the name extracted from the email (characters before '@').

**Example (Equal Split):**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "billName": "Cơm hến Ô Mân",
  "description": "Ăn trưa với nhóm",
  "creatorId": "507f1f77bcf86cd799439011",
  "payerId": "507f1f77bcf86cd799439011",
  "totalAmount": 350000,
  "paymentDate": 1699000000000,
  "splittingMethod": "equal",
  "participants": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439015",
    "507f1f77bcf86cd799439016",
    "507f1f77bcf86cd799439017"
  ],
  "items": [],
  "paymentStatus": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "amountOwed": 87500,
      "isPaid": true,
      "paidDate": 1699000000000
    },
    {
      "userId": "507f1f77bcf86cd799439015",
      "amountOwed": 87500,
      "isPaid": false,
      "paidDate": null
    },
    {
      "userId": "507f1f77bcf86cd799439016",
      "amountOwed": 87500,
      "isPaid": false,
      "paidDate": null
    },
    {
      "userId": "507f1f77bcf86cd799439017",
      "amountOwed": 87500,
      "isPaid": false,
      "paidDate": null
    }
  ],
  "isSettled": false,
  "optedOutUsers": [],
  "createdAt": 1699000000000,
  "updatedAt": null,
  "_destroy": false
}
```

**Example (Item-based Split with Discount/Tax):**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "billName": "Mua đồ chung",
  "description": "Có giảm giá 10% và thuế VAT",
  "creatorId": "507f1f77bcf86cd799439011",
  "payerId": "507f1f77bcf86cd799439011",
  "totalAmount": 198000, // Actual bill total (after 10% discount + 10% VAT)
  "paymentDate": 1699000000000,
  "splittingMethod": "item-based",
  "participants": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439015",
    "507f1f77bcf86cd799439016"
  ],
  "items": [
    {
      "name": "Bánh mì",
      "amount": 50000, // Original price before discount/tax
      "allocatedTo": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439015"]
    },
    {
      "name": "Cà phê",
      "amount": 150000, // Original price before discount/tax
      "allocatedTo": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"]
    }
  ],
  // Calculation:
  // A = 50000 + 150000 = 200000 (sum of item amounts)
  // B = 198000 (actual total)
  // C = 198000 / 200000 = 0.99 (adjustment ratio)
  // Bánh mì adjusted: 50000 × 0.99 = 49500
  // Cà phê adjusted: 150000 × 0.99 = 148500
  "paymentStatus": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "amountOwed": 74250, // (49500/2) + (148500/3) = 24750 + 49500
      "isPaid": true,
      "paidDate": 1699000000000
    },
    {
      "userId": "507f1f77bcf86cd799439015",
      "amountOwed": 74250, // (49500/2) + (148500/3) = 24750 + 49500
      "isPaid": false,
      "paidDate": null
    },
    {
      "userId": "507f1f77bcf86cd799439016",
      "amountOwed": 49500, // (148500/3) = 49500 (cà phê only)
      "isPaid": false,
      "paidDate": null
    }
  ],
  "isSettled": false,
  "optedOutUsers": [],
  "createdAt": 1699000000000,
  "updatedAt": null,
  "_destroy": false
}
```

---

### 3. Groups Collection

**Collection Name:** `groups`

**Purpose:** Manage user groups for easier bill sharing

**Schema:**
```javascript
{
  _id: ObjectId,
  groupName: String (required, 1-100 characters),
  description: String (optional, max 500 characters),
  creatorId: String (required, user ObjectId),
  members: [String] (array of user ObjectIds, min 1),
  bills: [String] (array of bill ObjectIds),
  avatar: String (URL, optional),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  _destroy: Boolean
}
```

**Indexes:**
- `creatorId`: Index for groups created by user
- `members`: Index for groups user belongs to
- `createdAt`: Descending index for sorting

**Note:** When creating groups with emails, the system will automatically find or create users by email. If a user doesn't exist, it will be created with the name extracted from the email (characters before '@').

**Example:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "groupName": "BỆT",
  "description": "Bully everyone together",
  "creatorId": "507f1f77bcf86cd799439015",
  "members": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439015",
    "507f1f77bcf86cd799439016",
    "507f1f77bcf86cd799439017"
  ],
  "bills": [
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ],
  "avatar": null,
  "createdAt": 1699000000000,
  "updatedAt": null,
  "_destroy": false
}
```

---

## Model Functions

### User Model (`userModel.js`)

- `createNew(data)` - Create a new user
- `findOneById(userId)` - Find user by ID
- `findOneByEmail(email)` - Find user by email
- `getAll()` - Get all users
- `update(userId, updateData)` - Update user information
- `deleteOneById(userId)` - Delete user
- `findOrCreateUserByEmail(email)` - Find user by email, or create if not exists (with name extracted from email)

### Bill Model (`billModel.js`)

- `createNew(data)` - Create a new bill (auto-calculates payment status)
- `findOneById(billId)` - Find bill by ID
- `getAll()` - Get all bills
- `getBillsByUser(userId)` - Get all bills for a user (by user ID)
- `getBillsByCreator(creatorId)` - Get bills created by user (by user ID)
- `update(billId, updateData)` - Update bill information
- `markAsPaid(billId, userId)` - Mark a user's payment as paid (by user ID)
- `optOutUser(billId, userId)` - Remove user from bill (by user ID)
- `deleteOneById(billId)` - Delete bill

### Group Model (`groupModel.js`)

- `createNew(data)` - Create a new group
- `findOneById(groupId)` - Find group by ID
- `getAll()` - Get all groups
- `getGroupsByUser(userId)` - Get groups user belongs to (by user ID)
- `update(groupId, updateData)` - Update group information
- `addMember(groupId, memberId)` - Add member to group (by user ID)
- `removeMember(groupId, memberId)` - Remove member from group (by user ID)
- `addBill(groupId, billId)` - Add bill to group
- `deleteOneById(groupId)` - Delete group