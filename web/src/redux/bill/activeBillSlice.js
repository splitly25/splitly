import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { createBillAPI, fetchUsersAPI, fetchGroupsAPI } from '~/apis'

const initialState = {
  // Form data
  billName: '',
  category: 'food',
  notes: '',
  creationDate: new Date().toISOString(),
  paymentDeadline: '',
  payer: null,
  splitType: 'equal',
  totalAmount: 0,

  // Participants
  participants: [],

  // Items for item-based split
  items: [
    {
      id: Date.now(),
      name: '',
      amount: 0,
      allocatedTo: [],
    },
  ],

  // Available users and groups
  availablePeople: [],
  availableGroups: [],
  searchedUsers: [],
  searchedGroups: [],

  // Pagination
  searchPagination: {
    users: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
    groups: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
  },
  normalPagination: {
    users: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
    groups: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
  },

  // Loading states
  isLoading: false,
  isLoadingData: false,
  isLoadingSearch: false,
  submitError: null,
}

// Async thunks
export const fetchInitialDataThunk = createAsyncThunk('activeBill/fetchInitialData', async (_, { rejectWithValue }) => {
  try {
    const [usersResponse, groupsResponse] = await Promise.all([
      fetchUsersAPI(1, 10, '').catch((err) => {
        console.error('Error fetching users:', err)
        return { users: [], pagination: { currentPage: 1, totalPages: 1, totalUsers: 0, limit: 10 } }
      }),
      fetchGroupsAPI(1, 10, '').catch((err) => {
        console.error('Error fetching groups:', err)
        return { groups: [], pagination: { page: 1, totalPages: 1, total: 0, limit: 10 } }
      }),
    ])

    return { usersResponse, groupsResponse }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const loadMoreDataThunk = createAsyncThunk(
  'activeBill/loadMoreData',
  async ({ page, limit, type }, { rejectWithValue }) => {
    try {
      let usersResponse = null
      let groupsResponse = null

      if (type === 'users' || type === 'both') {
        usersResponse = await fetchUsersAPI(page, limit, '').catch((err) => {
          console.error('Error fetching users:', err)
          return { users: [], pagination: { currentPage: 1, totalPages: 1, totalUsers: 0, limit: 10 } }
        })
      }

      if (type === 'groups' || type === 'both') {
        groupsResponse = await fetchGroupsAPI(page, limit, '').catch((err) => {
          console.error('Error fetching groups:', err)
          return { groups: [], pagination: { page: 1, totalPages: 1, total: 0, limit: 10 } }
        })
      }

      return { usersResponse, groupsResponse, type }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchDataThunk = createAsyncThunk(
  'activeBill/searchData',
  async ({ page, limit, search, type }, { rejectWithValue }) => {
    try {
      let usersResponse = null
      let groupsResponse = null

      if (type === 'users' || type === 'both') {
        usersResponse = await fetchUsersAPI(page, limit, search).catch((err) => {
          console.error('Error fetching users:', err)
          return { users: [], pagination: { currentPage: 1, totalPages: 1, totalUsers: 0, limit } }
        })
      }

      if (type === 'groups' || type === 'both') {
        groupsResponse = await fetchGroupsAPI(page, limit, search).catch((err) => {
          console.error('Error fetching groups:', err)
          return { groups: [], pagination: { page: 1, totalPages: 1, total: 0, limit } }
        })
      }

      return { usersResponse, groupsResponse, type }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const submitBillThunk = createAsyncThunk('activeBill/submitBill', async (billData, { rejectWithValue }) => {
  try {
    const response = await createBillAPI(billData)
    toast.success('Hóa đơn đã được tạo thành công!')
    return response
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi khi tạo hóa đơn. Vui lòng thử lại.'
    toast.error(errorMessage)
    return rejectWithValue(errorMessage)
  }
})

export const activeBillSlice = createSlice({
  name: 'activeBill',
  initialState,
  reducers: {
    // Form field updates
    updateField: (state, action) => {
      const { field, value } = action.payload
      state[field] = value
    },

    // Participant management
    addParticipants: (state, action) => {
      const newParticipants = action.payload.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        amount: 0,
        usedAmount: 0,
        groups: p.groups || [],
      }))

      const existingIds = state.participants.map((p) => p.id)
      const uniqueParticipants = newParticipants.filter((p) => !existingIds.includes(p.id))

      state.participants = [...state.participants, ...uniqueParticipants]
    },

    removeParticipant: (state, action) => {
      state.participants = state.participants.filter((p) => p.id !== action.payload)
    },

    updateParticipantAmount: (state, action) => {
      const { id, amount } = action.payload
      const participant = state.participants.find((p) => p.id === id)
      if (participant) {
        participant.usedAmount = amount
      }
    },

    // Item management
    addItem: (state) => {
      state.items.push({
        id: Date.now(),
        name: '',
        amount: 0,
        allocatedTo: [],
      })
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    updateItem: (state, action) => {
      const { id, field, value } = action.payload
      const item = state.items.find((item) => item.id === id)
      if (item) {
        item[field] = value
      }
    },

    toggleItemAllocation: (state, action) => {
      const { itemId, participantId } = action.payload
      const item = state.items.find((item) => item.id === itemId)
      if (item) {
        if (item.allocatedTo.includes(participantId)) {
          item.allocatedTo = item.allocatedTo.filter((id) => id !== participantId)
        } else {
          item.allocatedTo.push(participantId)
        }
      }
    },

    // Calculate amounts
    calculateAmounts: (state) => {
      const total = parseFloat(state.totalAmount) || 0

      if (state.splitType === 'equal' && state.participants.length > 0) {
        const perPerson = total / state.participants.length
        state.participants.forEach((p) => {
          p.amount = perPerson
        })
      } else if (state.splitType === 'by-person') {
        const totalUsed = state.participants.reduce((sum, p) => sum + (parseFloat(p.usedAmount) || 0), 0)
        if (totalUsed > 0) {
          state.participants.forEach((p) => {
            p.amount = ((parseFloat(p.usedAmount) || 0) / totalUsed) * total
          })
        }
      } else if (state.splitType === 'by-item') {
        const participantAmounts = {}
        state.participants.forEach((p) => {
          participantAmounts[p.id] = 0
        })

        state.items.forEach((item) => {
          const itemAmount = parseFloat(item.amount) || 0
          const allocatedCount = item.allocatedTo.length
          if (allocatedCount > 0) {
            const perPerson = itemAmount / allocatedCount
            item.allocatedTo.forEach((participantId) => {
              if (participantAmounts[participantId] !== undefined) {
                participantAmounts[participantId] += perPerson
              }
            })
          }
        })

        state.participants.forEach((p) => {
          p.amount = participantAmounts[p.id] || 0
        })
      }
    },

    distributeDifference: (state, action) => {
      const { difference, shouldAdd } = action.payload
      const differencePerPerson = difference / state.participants.length
      state.participants.forEach((p) => {
        p.amount = p.amount + (shouldAdd ? differencePerPerson : -differencePerPerson)
      })
    },

    // Reset bill
    resetBill: (state) => {
      Object.assign(state, initialState)
      state.creationDate = new Date().toISOString()
      state.items = [
        {
          id: Date.now(),
          name: '',
          amount: 0,
          allocatedTo: [],
        },
      ]
    },

    initializeBill: (state, action) => {
      const { currentUserId } = action.payload
      state.payer = currentUserId
      state.participants = [
        {
          id: currentUserId,
          name: action.payload.currentUserName || '',
          email: action.payload.currentUserEmail || '',
          amount: 0,
          usedAmount: 0,
        },
      ]
    },

    setSubmitError: (state, action) => {
      state.submitError = action.payload
    },
  },

  extraReducers: (builder) => {
    // Fetch initial data
    builder.addCase(fetchInitialDataThunk.pending, (state) => {
      state.isLoadingData = true
    })
    builder.addCase(fetchInitialDataThunk.fulfilled, (state, action) => {
      const { usersResponse, groupsResponse } = action.payload

      // Transform users
      state.availablePeople = usersResponse.users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }))

      // Transform groups
      state.availableGroups = groupsResponse.groups.map((group) => ({
        id: group._id,
        name: group.groupName || group.name,
        members: (group.members || []).map((member) => ({
          id: member._id,
          name: member.name,
          email: member.email,
          avatar: member.avatar,
        })),
      }))

      // Update pagination
      state.normalPagination.users = {
        currentPage: usersResponse.pagination.currentPage || usersResponse.pagination.page || 1,
        totalPages: usersResponse.pagination.totalPages || 1,
        total: usersResponse.pagination.totalUsers || usersResponse.pagination.total || 0,
        limit: usersResponse.pagination.limit || 10,
      }

      state.normalPagination.groups = {
        currentPage: groupsResponse.pagination.page || groupsResponse.pagination.currentPage || 1,
        totalPages: groupsResponse.pagination.totalPages || 1,
        total: groupsResponse.pagination.total || groupsResponse.pagination.totalGroups || 0,
        limit: groupsResponse.pagination.limit || 10,
      }

      state.isLoadingData = false
    })
    builder.addCase(fetchInitialDataThunk.rejected, (state, action) => {
      state.isLoadingData = false
      state.submitError = action.payload || 'Không thể tải danh sách nhóm và thành viên'
    })

    // Load more data
    builder.addCase(loadMoreDataThunk.fulfilled, (state, action) => {
      const { usersResponse, groupsResponse, type } = action.payload

      if (usersResponse && (type === 'users' || type === 'both')) {
        const transformedUsers = usersResponse.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }))
        state.availablePeople = [...state.availablePeople, ...transformedUsers]
        state.normalPagination.users = {
          currentPage: usersResponse.pagination.currentPage || usersResponse.pagination.page || 1,
          totalPages: usersResponse.pagination.totalPages || 1,
          total: usersResponse.pagination.totalUsers || usersResponse.pagination.total || 0,
          limit: usersResponse.pagination.limit || 10,
        }
      }

      if (groupsResponse && (type === 'groups' || type === 'both')) {
        const transformedGroups = groupsResponse.groups.map((group) => ({
          id: group._id,
          name: group.groupName || group.name,
          members: (group.members || []).map((member) => ({
            id: member._id,
            name: member.name,
            email: member.email,
            avatar: member.avatar,
          })),
        }))
        state.availableGroups = [...state.availableGroups, ...transformedGroups]
        state.normalPagination.groups = {
          currentPage: groupsResponse.pagination.page || groupsResponse.pagination.currentPage || 1,
          totalPages: groupsResponse.pagination.totalPages || 1,
          total: groupsResponse.pagination.total || groupsResponse.pagination.totalGroups || 0,
          limit: groupsResponse.pagination.limit || 10,
        }
      }
    })

    // Search data
    builder.addCase(searchDataThunk.pending, (state) => {
      state.isLoadingSearch = true
    })
    builder.addCase(searchDataThunk.fulfilled, (state, action) => {
      const { usersResponse, groupsResponse, type } = action.payload

      if (usersResponse && (type === 'users' || type === 'both')) {
        const transformedUsers = usersResponse.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }))
        state.searchedUsers = transformedUsers
        state.searchPagination.users = {
          currentPage: usersResponse.pagination.currentPage || usersResponse.pagination.page || 1,
          totalPages: usersResponse.pagination.totalPages || 1,
          total: usersResponse.pagination.totalUsers || usersResponse.pagination.total || 0,
          limit: usersResponse.pagination.limit || 10,
        }
      }

      if (groupsResponse && (type === 'groups' || type === 'both')) {
        const transformedGroups = groupsResponse.groups.map((group) => ({
          id: group._id,
          name: group.groupName || group.name,
          members: (group.members || []).map((member) => ({
            id: member._id,
            name: member.name,
            email: member.email,
            avatar: member.avatar,
          })),
        }))
        state.searchedGroups = transformedGroups
        state.searchPagination.groups = {
          currentPage: groupsResponse.pagination.page || groupsResponse.pagination.currentPage || 1,
          totalPages: groupsResponse.pagination.totalPages || 1,
          total: groupsResponse.pagination.total || groupsResponse.pagination.totalGroups || 0,
          limit: groupsResponse.pagination.limit || 10,
        }
      }

      state.isLoadingSearch = false
    })
    builder.addCase(searchDataThunk.rejected, (state) => {
      state.isLoadingSearch = false
    })

    // Submit bill
    builder.addCase(submitBillThunk.pending, (state) => {
      state.isLoading = true
      state.submitError = null
    })
    builder.addCase(submitBillThunk.fulfilled, (state) => {
      state.isLoading = false
      // Reset will be handled in the component after navigation
    })
    builder.addCase(submitBillThunk.rejected, (state, action) => {
      state.isLoading = false
      state.submitError = action.payload
    })
  },
})

export const {
  updateField,
  addParticipants,
  removeParticipant,
  updateParticipantAmount,
  addItem,
  removeItem,
  updateItem,
  toggleItemAllocation,
  calculateAmounts,
  distributeDifference,
  resetBill,
  initializeBill,
  setSubmitError,
} = activeBillSlice.actions

// Selectors
export const selectActiveBill = (state) => state.activeBill
export const selectParticipants = (state) => state.activeBill.participants
export const selectItems = (state) => state.activeBill.items
export const selectAvailablePeople = (state) => state.activeBill.availablePeople
export const selectAvailableGroups = (state) => state.activeBill.availableGroups
export const selectSearchedUsers = (state) => state.activeBill.searchedUsers
export const selectSearchedGroups = (state) => state.activeBill.searchedGroups
export const selectIsLoading = (state) => state.activeBill.isLoading
export const selectIsLoadingData = (state) => state.activeBill.isLoadingData
export const selectIsLoadingSearch = (state) => state.activeBill.isLoadingSearch
export const selectSubmitError = (state) => state.activeBill.submitError

export const activeBillReducer = activeBillSlice.reducer
