/**
 * Database Initialization Script
 * Creates indexes and initial setup for MongoDB collections
 */

import { GET_DB } from './mongodb.js'
import { userModel, billModel, groupModel } from '~/models/index.js'

export const initializeDatabase = async () => {
  try {    
    const db = GET_DB()
    
    // ===== USER COLLECTION INDEXES =====
    await db.collection(userModel.USER_COLLECTION_NAME).createIndex(
      { email: 1 }, 
      { unique: true, name: 'email_unique_index' }
    )
    await db.collection(userModel.USER_COLLECTION_NAME).createIndex(
      { createdAt: -1 }, 
      { name: 'created_at_index' }
    )

    // ===== BILL COLLECTION INDEXES =====
    await db.collection(billModel.BILL_COLLECTION_NAME).createIndex(
      { creatorEmail: 1 }, 
      { name: 'creator_email_index' }
    )
    await db.collection(billModel.BILL_COLLECTION_NAME).createIndex(
      { payerEmail: 1 }, 
      { name: 'payer_email_index' }
    )
    await db.collection(billModel.BILL_COLLECTION_NAME).createIndex(
      { participants: 1 }, 
      { name: 'participants_index' }
    )
    await db.collection(billModel.BILL_COLLECTION_NAME).createIndex(
      { isSettled: 1 }, 
      { name: 'is_settled_index' }
    )
    await db.collection(billModel.BILL_COLLECTION_NAME).createIndex(
      { createdAt: -1 }, 
      { name: 'created_at_index' }
    )
    await db.collection(billModel.BILL_COLLECTION_NAME).createIndex(
      { paymentDate: -1 }, 
      { name: 'payment_date_index' }
    )

    // ===== GROUP COLLECTION INDEXES =====
    await db.collection(groupModel.GROUP_COLLECTION_NAME).createIndex(
      { creatorEmail: 1 }, 
      { name: 'creator_email_index' }
    )
    await db.collection(groupModel.GROUP_COLLECTION_NAME).createIndex(
      { members: 1 }, 
      { name: 'members_index' }
    )
    await db.collection(groupModel.GROUP_COLLECTION_NAME).createIndex(
      { createdAt: -1 }, 
      { name: 'created_at_index' }
    )
    
    console.log('Database initialization: Success')
    
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}
