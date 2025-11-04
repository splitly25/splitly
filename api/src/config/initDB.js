/**
 * Database Initialization Script
 * Creates indexes and initial setup for MongoDB collections
 */

import { GET_DB } from './mongodb.js'
import { userModel, billModel, groupModel, activityModel } from '~/models/index.js'

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
      { creatorId: 1 }, 
      { name: 'creator_id_index' }
    )
    await db.collection(billModel.BILL_COLLECTION_NAME).createIndex(
      { payerId: 1 }, 
      { name: 'payer_id_index' }
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
      { creatorId: 1 }, 
      { name: 'creator_id_index' }
    )
    await db.collection(groupModel.GROUP_COLLECTION_NAME).createIndex(
      { members: 1 }, 
      { name: 'members_index' }
    )
    await db.collection(groupModel.GROUP_COLLECTION_NAME).createIndex(
      { createdAt: -1 }, 
      { name: 'created_at_index' }
    )

    // ===== ACTIVITY COLLECTION INDEXES =====
    await db.collection(activityModel.ACTIVITY_COLLECTION_NAME).createIndex(
      { userId: 1 }, 
      { name: 'user_id_index' }
    )
    await db.collection(activityModel.ACTIVITY_COLLECTION_NAME).createIndex(
      { resourceType: 1, resourceId: 1 }, 
      { name: 'resource_index' }
    )
    await db.collection(activityModel.ACTIVITY_COLLECTION_NAME).createIndex(
      { activityType: 1 }, 
      { name: 'activity_type_index' }
    )
    await db.collection(activityModel.ACTIVITY_COLLECTION_NAME).createIndex(
      { createdAt: -1 }, 
      { name: 'created_at_index' }
    )
    await db.collection(activityModel.ACTIVITY_COLLECTION_NAME).createIndex(
      { userId: 1, createdAt: -1 }, 
      { name: 'user_activity_timeline_index' }
    )
    
    console.log('Database initialization: Success')
    
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}
