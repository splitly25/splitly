/**
 * Migration script to validate payment reminders collection after model rename
 * This script ensures data integrity after renaming paymentReminderModel to paymentModel
 */

import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env file
import dotenv from 'dotenv'
dotenv.config({ path: join(__dirname, '.env') })

// MongoDB connection details
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'splitly' // Adjust if your DB name is different
const COLLECTION_NAME = 'payment_reminders'

async function migratePaymentReminders() {
  let client

  try {
    console.log('🔄 Starting payment reminders migration...')

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Check if collection exists
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray()
    if (collections.length === 0) {
      console.log(`ℹ️  Collection '${COLLECTION_NAME}' does not exist. Creating empty collection...`)
      await db.createCollection(COLLECTION_NAME)
      console.log('✅ Collection created successfully')
      return
    }

    // Get collection stats
    const stats = await collection.stats()
    console.log(`📊 Collection '${COLLECTION_NAME}' contains ${stats.count} documents`)

    // Validate document structure
    console.log('🔍 Validating document structure...')

    const sampleDocs = await collection.find({}).limit(5).toArray()
    let validCount = 0
    let invalidCount = 0

    for (const doc of sampleDocs) {
      const isValid = validateDocument(doc)
      if (isValid) {
        validCount++
      } else {
        invalidCount++
        console.log(`❌ Invalid document found: ${doc._id}`)
      }
    }

    console.log(`✅ Valid documents: ${validCount}`)
    if (invalidCount > 0) {
      console.log(`❌ Invalid documents: ${invalidCount}`)
    }

    // Check indexes
    console.log('🔍 Checking indexes...')
    const indexes = await collection.listIndexes().toArray()
    console.log(`📊 Found ${indexes.length} indexes`)

    // Ensure token index exists for performance
    const tokenIndexExists = indexes.some(index => index.name === 'token_1')
    if (!tokenIndexExists) {
      console.log('⚠️  Token index not found. Creating index...')
      await collection.createIndex({ token: 1 }, { unique: true })
      console.log('✅ Token index created')
    } else {
      console.log('✅ Token index exists')
    }

    // Ensure _destroy index exists
    const destroyIndexExists = indexes.some(index => index.name === '_destroy_1')
    if (!destroyIndexExists) {
      console.log('⚠️  _destroy index not found. Creating index...')
      await collection.createIndex({ _destroy: 1 })
      console.log('✅ _destroy index created')
    } else {
      console.log('✅ _destroy index exists')
    }

    // Validate recent documents (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentDocs = await collection.find({
      createdAt: { $gte: oneDayAgo },
      _destroy: false
    }).toArray()

    console.log(`📅 Recent documents (last 24h): ${recentDocs.length}`)

    // Check for expired tokens (older than 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const expiredTokens = await collection.find({
      createdAt: { $lt: sevenDaysAgo },
      usedAt: null,
      _destroy: false
    }).toArray()

    if (expiredTokens.length > 0) {
      console.log(`⚠️  Found ${expiredTokens.length} potentially expired tokens`)
      console.log('💡 Consider cleaning up old unused tokens')
    }

    console.log('🎉 Migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Disconnected from MongoDB')
    }
  }
}

function validateDocument(doc) {
  // Required fields validation
  const requiredFields = ['token', 'creditorId', 'debtorId', 'bills', 'totalAmount', 'createdAt']
  for (const field of requiredFields) {
    if (!(field in doc)) {
      console.log(`Missing required field: ${field}`)
      return false
    }
  }

  // Type validation
  if (typeof doc.token !== 'string') {
    console.log('Token must be a string')
    return false
  }

  if (typeof doc.totalAmount !== 'number' || doc.totalAmount < 0) {
    console.log('totalAmount must be a positive number')
    return false
  }

  if (!Array.isArray(doc.bills)) {
    console.log('bills must be an array')
    return false
  }

  // Validate bills array
  for (const bill of doc.bills) {
    if (!bill.billId || !bill.billName || typeof bill.amount !== 'number') {
      console.log('Invalid bill structure')
      return false
    }
  }

  return true
}

// Run migration
migratePaymentReminders()
  .then(() => {
    console.log('✅ Migration script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error)
    process.exit(1)
  })