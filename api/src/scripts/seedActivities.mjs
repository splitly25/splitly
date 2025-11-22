import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://splitly:splitly@splitly.hxbia.mongodb.net/?retryWrites=true&w=majority&appName=Splitly'
const DATABASE_NAME = process.env.DATABASE_NAME || 'splitly'

const userId = '69103dbc2b799125f830376e'
const fakeBillId = new ObjectId()
const fakeGroupId = new ObjectId()
const fakeUserId = new ObjectId()
const fakePaymentId = new ObjectId()

const activities = [
  // Bill activities
  {
    activityType: 'bill_created',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      billName: 'Dinner at Restaurant',
      amount: 150000,
      description: 'Team dinner'
    },
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'bill_updated',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      billName: 'Dinner at Restaurant',
      previousValue: { amount: 150000 },
      newValue: { amount: 180000 }
    },
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'bill_deleted',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: new ObjectId(),
    details: {
      billName: 'Old Coffee Bill',
      amount: 50000
    },
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'bill_paid',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      billName: 'Dinner at Restaurant',
      amount: 60000,
      paymentStatus: 'paid'
    },
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'bill_settled',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      billName: 'Dinner at Restaurant',
      amount: 180000
    },
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'bill_reminder_sent',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      billName: 'Dinner at Restaurant',
      reminderType: 'email',
      recipientId: fakeUserId
    },
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'bill_user_opted_out',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      billName: 'Dinner at Restaurant',
      userEmail: 'user@example.com',
      userName: 'John Doe'
    },
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    _destroy: false
  },

  // Payment activities
  {
    activityType: 'payment_initiated',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      amount: 60000,
      paymentId: fakePaymentId,
      debtorName: 'John Doe',
      creditorName: 'Jane Smith'
    },
    createdAt: Date.now() - 10 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'payment_confirmed',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: fakeBillId,
    details: {
      amount: 60000,
      paymentId: fakePaymentId,
      debtorName: 'John Doe',
      creditorName: 'Jane Smith',
      note: 'Payment received via bank transfer'
    },
    createdAt: Date.now() - 8 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'payment_rejected',
    userId: new ObjectId(userId),
    resourceType: 'bill',
    resourceId: new ObjectId(),
    details: {
      amount: 30000,
      paymentId: new ObjectId(),
      debtorName: 'Bob Wilson',
      creditorName: 'Jane Smith',
      note: 'Insufficient funds'
    },
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    _destroy: false
  },

  // Debt activities
  {
    activityType: 'debt_balanced',
    userId: new ObjectId(userId),
    resourceType: 'user',
    resourceId: fakeUserId,
    details: {
      amount: 100000,
      debtorName: 'John Doe',
      creditorName: 'Jane Smith'
    },
    createdAt: Date.now() - 4 * 60 * 60 * 1000,
    _destroy: false
  },

  // Group activities
  {
    activityType: 'group_created',
    userId: new ObjectId(userId),
    resourceType: 'group',
    resourceId: fakeGroupId,
    details: {
      groupName: 'Weekend Trip Gang'
    },
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'group_updated',
    userId: new ObjectId(userId),
    resourceType: 'group',
    resourceId: fakeGroupId,
    details: {
      groupName: 'Weekend Trip Gang',
      previousValue: { name: 'Trip Gang' },
      newValue: { name: 'Weekend Trip Gang' }
    },
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'group_deleted',
    userId: new ObjectId(userId),
    resourceType: 'group',
    resourceId: new ObjectId(),
    details: {
      groupName: 'Old Project Team'
    },
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'group_member_added',
    userId: new ObjectId(userId),
    resourceType: 'group',
    resourceId: fakeGroupId,
    details: {
      groupName: 'Weekend Trip Gang',
      memberEmail: 'newmember@example.com',
      memberId: new ObjectId()
    },
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'group_member_removed',
    userId: new ObjectId(userId),
    resourceType: 'group',
    resourceId: fakeGroupId,
    details: {
      groupName: 'Weekend Trip Gang',
      memberEmail: 'removed@example.com',
      memberId: new ObjectId()
    },
    createdAt: Date.now() - 30 * 60 * 1000,
    _destroy: false
  },
  {
    activityType: 'group_bill_added',
    userId: new ObjectId(userId),
    resourceType: 'group',
    resourceId: fakeGroupId,
    details: {
      groupName: 'Weekend Trip Gang',
      billName: 'Hotel Booking',
      amount: 500000
    },
    createdAt: Date.now() - 10 * 60 * 1000,
    _destroy: false
  }
]

async function seedActivities() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db(DATABASE_NAME)
    const collection = db.collection('activities')

    const result = await collection.insertMany(activities)
    console.log(`Successfully inserted ${result.insertedCount} activity documents`)
    console.log('Activity types seeded:')
    activities.forEach(a => console.log(`  - ${a.activityType}`))

  } catch (error) {
    console.error('Error seeding activities:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

seedActivities()
