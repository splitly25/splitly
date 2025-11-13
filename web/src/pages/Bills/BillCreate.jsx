import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { Box, Typography, Button, IconButton } from '@mui/material'
import { COLORS } from '~/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import AddParticipantDialog from '~/components/Bills/AddParticipantDialog'
import SelectPayerDialog from '~/components/Bills/SelectPayerDialog'
import GeneralInformationSection from '~/components/Bills/GeneralInformationSection'
import ParticipantsSection from '~/components/Bills/ParticipantsSection'
import EqualSplitDetails from '~/components/Bills/EqualSplitDetails'
import ByPersonSplitDetails from '~/components/Bills/ByPersonSplitDetails'
import ByItemSplitDetails from '~/components/Bills/ByItemSplitDetails'
import { createBillAPI, fetchUsersAPI, fetchGroupsAPI } from '~/apis'
import { useForm } from 'react-hook-form'

function BillCreate() {
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  // React Hook Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      billName: '',
      category: 'food',
      notes: '',
      creationDate: new Date().toISOString(),
      paymentDeadline: '',
      payer: currentUser?._id || '',
      splitType: 'equal',
      totalAmount: 0,
    },
  })

  // Watch form values
  const watchedValues = watch()
  const { splitType, totalAmount } = watchedValues

  // Participants state
  const [participants, setParticipants] = useState([
    {
      id: currentUser?._id,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      amount: 0,
      usedAmount: 0,
    },
  ])

  // Items state for item-based split
  const [items, setItems] = useState([
    {
      id: Date.now(),
      name: '',
      amount: 0,
      allocatedTo: [],
    },
  ])

  // Dialog states
  const [openParticipantDialog, setOpenParticipantDialog] = useState(false)
  const [openPayerDialog, setOpenPayerDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Real data states
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [availableGroups, setAvailableGroups] = useState([])
  const [availablePeople, setAvailablePeople] = useState([])
  const [searchedUsers, setSearchedUsers] = useState([])
  const [searchedGroups, setSearchedGroups] = useState([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [searchPagination, setSearchPagination] = useState({
    users: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
    groups: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
  })
  const [normalPagination, setNormalPagination] = useState({
    users: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
    groups: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
  })

  // Handler for loading more in normal mode (non-search)
  const handleLoadMore = async (page = 1, limit = 10, append = true, type = 'both') => {
    try {
      setIsLoadingData(true)

      if (type === 'users' || type === 'both') {
        const usersResponse = await fetchUsersAPI(page, limit, '').catch((err) => {
          console.error('Error fetching users:', err)
          return { users: [], pagination: { currentPage: 1, totalPages: 1, totalUsers: 0, limit: 10 } }
        })

        const transformedUsers = usersResponse.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }))

        if (append) {
          setAvailablePeople((prev) => [...prev, ...transformedUsers])
        } else {
          setAvailablePeople(transformedUsers)
        }

        setNormalPagination((prev) => ({
          ...prev,
          users: {
            currentPage: usersResponse.pagination.currentPage || usersResponse.pagination.page || 1,
            totalPages: usersResponse.pagination.totalPages || 1,
            total: usersResponse.pagination.totalUsers || usersResponse.pagination.total || 0,
            limit: usersResponse.pagination.limit || limit,
          },
        }))
      }

      if (type === 'groups' || type === 'both') {
        const groupsResponse = await fetchGroupsAPI(page, limit, '').catch((err) => {
          console.error('Error fetching groups:', err)
          return { groups: [], pagination: { page: 1, totalPages: 1, total: 0, limit: 10 } }
        })

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

        if (append) {
          setAvailableGroups((prev) => [...prev, ...transformedGroups])
        } else {
          setAvailableGroups(transformedGroups)
        }

        setNormalPagination((prev) => ({
          ...prev,
          groups: {
            currentPage: groupsResponse.pagination.page || groupsResponse.pagination.currentPage || 1,
            totalPages: groupsResponse.pagination.totalPages || 1,
            total: groupsResponse.pagination.total || groupsResponse.pagination.totalGroups || 0,
            limit: groupsResponse.pagination.limit || limit,
          },
        }))
      }
    } catch (error) {
      console.error('Error loading more:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  // Unified search handler - fetches both users and groups
  const handleSearch = async (page = 1, limit = 10, search = '', append = false, type = 'both') => {
    if (!search.trim()) {
      setSearchedUsers([])
      setSearchedGroups([])
      return
    }

    try {
      setIsLoadingSearch(true)

      // Fetch based on type parameter
      if (type === 'users' || type === 'both') {
        const usersResponse = await fetchUsersAPI(page, limit, search).catch((err) => {
          console.error('Error fetching users:', err)
          return { users: [], pagination: { currentPage: 1, totalPages: 1, totalUsers: 0, limit } }
        })

        // Transform users data
        const transformedUsers = usersResponse.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }))

        if (append) {
          setSearchedUsers((prev) => [...prev, ...transformedUsers])
        } else {
          setSearchedUsers(transformedUsers)
        }

        setSearchPagination((prev) => ({
          ...prev,
          users: {
            currentPage: usersResponse.pagination.currentPage || usersResponse.pagination.page || 1,
            totalPages: usersResponse.pagination.totalPages || 1,
            total: usersResponse.pagination.totalUsers || usersResponse.pagination.total || 0,
            limit: usersResponse.pagination.limit || limit,
          },
        }))
      }

      if (type === 'groups' || type === 'both') {
        const groupsResponse = await fetchGroupsAPI(page, limit, search).catch((err) => {
          console.error('Error fetching groups:', err)
          return { groups: [], pagination: { page: 1, totalPages: 1, total: 0, limit } }
        })

        // Transform groups data
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

        if (append) {
          setSearchedGroups((prev) => [...prev, ...transformedGroups])
        } else {
          setSearchedGroups(transformedGroups)
        }

        setSearchPagination((prev) => ({
          ...prev,
          groups: {
            currentPage: groupsResponse.pagination.page || groupsResponse.pagination.currentPage || 1,
            totalPages: groupsResponse.pagination.totalPages || 1,
            total: groupsResponse.pagination.total || groupsResponse.pagination.totalGroups || 0,
            limit: groupsResponse.pagination.limit || limit,
          },
        }))
      }
    } catch (error) {
      console.error('Error searching:', error)
      if (!append) {
        if (type === 'users' || type === 'both') setSearchedUsers([])
        if (type === 'groups' || type === 'both') setSearchedGroups([])
      }
    } finally {
      setIsLoadingSearch(false)
    }
  }

  // Fetch initial users and groups with pagination
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!currentUser?._id) return

      try {
        setIsLoadingData(true)

        // Fetch first page of users and groups in parallel
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

        // Transform users data
        const transformedUsers = usersResponse.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }))

        // Transform groups data
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

        setAvailablePeople(transformedUsers)
        setAvailableGroups(transformedGroups)

        setNormalPagination({
          users: {
            currentPage: usersResponse.pagination.currentPage || usersResponse.pagination.page || 1,
            totalPages: usersResponse.pagination.totalPages || 1,
            total: usersResponse.pagination.totalUsers || usersResponse.pagination.total || 0,
            limit: usersResponse.pagination.limit || 10,
          },
          groups: {
            currentPage: groupsResponse.pagination.page || groupsResponse.pagination.currentPage || 1,
            totalPages: groupsResponse.pagination.totalPages || 1,
            total: groupsResponse.pagination.total || groupsResponse.pagination.totalGroups || 0,
            limit: groupsResponse.pagination.limit || 10,
          },
        })
      } catch (error) {
        console.error('Error fetching initial data:', error)
        setSubmitError('Không thể tải danh sách nhóm và thành viên')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchInitialData()
  }, [currentUser?._id])

  const handleAddParticipants = (newParticipants) => {
    const participantsToAdd = newParticipants.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      amount: 0,
      usedAmount: 0,
    }))

    // Filter out duplicates
    const existingIds = participants.map((p) => p.id)
    const uniqueParticipants = participantsToAdd.filter((p) => !existingIds.includes(p.id))

    setParticipants([...participants, ...uniqueParticipants])
  }

  // Get the selected payer's name for display
  const getPayerName = () => {
    const payerId = getValues('payer')
    const payer = participants.find((p) => p.id === payerId)
    return payer ? payer.name : 'Chọn người ứng tiền'
  }

  const handleDeleteParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id))
  }

  // Money amount change handler 
  const handleParticipantAmountChange = (id, amount) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, usedAmount: amount } : p)))
  }

  // Item management handlers for item-based split
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: '',
        amount: 0,
        allocatedTo: [],
      },
    ])
  }

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleItemChange = (id, field, value) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleItemAllocationToggle = (itemId, participantId) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const allocatedTo = item.allocatedTo.includes(participantId)
            ? item.allocatedTo.filter((id) => id !== participantId)
            : [...item.allocatedTo, participantId]
          return { ...item, allocatedTo }
        }
        return item
      })
    )
  }

  const handleCalculate = () => {
    const total = parseFloat(totalAmount) || 0
    if (splitType === 'equal' && participants.length > 0) {
      const perPerson = total / participants.length
      setParticipants(participants.map((p) => ({ ...p, amount: perPerson })))
    } else if (splitType === 'by-person') {
      // Calculate based on used amounts
      const totalUsed = participants.reduce((sum, p) => sum + (p.usedAmount || 0), 0)
      if (totalUsed > 0) {
        setParticipants(
          participants.map((p) => ({
            ...p,
            amount: (p.usedAmount / totalUsed) * total,
          }))
        )
      }
    } else if (splitType === 'by-item') {
      // Calculate based on item allocations
      const participantAmounts = {}
      participants.forEach((p) => {
        participantAmounts[p.id] = 0
      })

      items.forEach((item) => {
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

      setParticipants(
        participants.map((p) => ({
          ...p,
          amount: participantAmounts[p.id] || 0,
        }))
      )
    }
  }

  useEffect(() => {
    handleCalculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitType, totalAmount, participants.length, items])

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)
      setSubmitError(null)

      if (!formData.totalAmount || formData.totalAmount <= 0) {
        setSubmitError('Vui lòng nhập số tiền hợp lệ')
        return
      }

      // Base bill data for all split types
      const billData = {
        billName: formData.billName,
        creatorId: currentUser?._id,
        payerId: formData.payer,
        totalAmount: parseFloat(formData.totalAmount),
        paymentDate: formData.creationDate,
        description: formData.notes,
        category: formData.category,
        participants: participants.map((p) => String(p.id)),
      }

      // Add type-specific fields based on splitType
      if (formData.splitType === 'equal') {
        // Equal split - only needs participants
        billData.splittingMethod = 'equal'
      } else if (formData.splitType === 'by-item') {
        // Item-based split - needs items array
        billData.splittingMethod = 'item-based'
        billData.items = items
          .filter((item) => item.name && item.amount > 0 && item.allocatedTo.length > 0)
          .map((item) => ({
            name: item.name,
            amount: parseFloat(item.amount),
            allocatedTo: item.allocatedTo.map((id) => String(id)),
          }))

        if (billData.items.length === 0) {
          setSubmitError('Vui lòng thêm ít nhất một món hàng cho phương thức chia theo món')
          return
        }
      } else if (formData.splitType === 'by-person') {
        // People-based split - needs paymentStatus array
        billData.splittingMethod = 'people-based'
        billData.paymentStatus = participants.map((p) => ({
          userId: String(p.id),
          amountOwed: parseFloat(p.amount || 0),
        }))
      }

      await createBillAPI(billData)
      navigate('/history')
    } catch (error) {
      console.error('Error creating bill:', error)
      setSubmitError(error.response?.data?.message || 'Lỗi khi tạo hóa đơn. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <Box
      sx={(theme) => ({
        height: '100vh',
        overflow: 'auto',
        backgroundColor: theme.palette.background.default,
      })}
    >
      <Box
        sx={{
          padding: '32px',
          maxWidth: '963px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <IconButton
            sx={(theme) => ({
              width: '36px',
              height: '36px',
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            })}
            onClick={handleCancel}
          >
            <ArrowBackIcon sx={{ width: '16px', height: '16px' }} />
          </IconButton>
          <Box>
            <Typography
              sx={(theme) => ({
                fontFamily: "'Nunito Sans', sans-serif",
                lineHeight: '36px',
                color: theme.palette.text.primary,
                marginBottom: '4px',
              })}
              style={{ fontSize: '24px', fontWeight: 'bold' }}
            >
              Tạo hóa đơn mới
            </Typography>
            <Typography
              sx={(theme) => ({
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '24px',
                color: theme.palette.text.secondary,
              })}
            >
              Nhập thông tin thủ công
            </Typography>
          </Box>
        </Box>

        {submitError && <FieldErrorAlert message={submitError} />}

        {/* General Information Section */}
        <GeneralInformationSection
          control={control}
          getPayerName={getPayerName}
          onOpenPayerDialog={() => setOpenPayerDialog(true)}
        />

        {/* Participants Section */}
        <ParticipantsSection
          participants={participants}
          splitType={splitType}
          onOpenParticipantDialog={() => setOpenParticipantDialog(true)}
          onDeleteParticipant={handleDeleteParticipant}
          onParticipantAmountChange={handleParticipantAmountChange}
        />
        {/* Split Details Section */}
        {splitType === 'equal' && (
          <EqualSplitDetails control={control} participants={participants} totalAmount={totalAmount} />
        )}

        {splitType === 'by-person' && (
          <ByPersonSplitDetails
            control={control}
            participants={participants}
            totalAmount={totalAmount}
            setValue={setValue}
          />
        )}

        {splitType === 'by-item' && (
          <ByItemSplitDetails
            control={control}
            participants={participants}
            totalAmount={totalAmount}
            items={items}
            setValue={setValue}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onItemChange={handleItemChange}
            onItemAllocationToggle={handleItemAllocationToggle}
          />
        )}
      </Box>

      {/* Fixed Action Buttons */}
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          bottom: '0',
          left: { xs: '0', md: '256px' },
          right: '0',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `0.8px solid ${theme.palette.divider}`,
          borderRadius: '16px 16px 0 0',
          padding: { xs: '12px', sm: '16px' },
          gap: { xs: '8px', sm: '12px' },
          zIndex: 1000,
          boxShadow: theme.palette.mode === 'dark' ? '0 -2px 10px rgba(0,0,0,0.3)' : '0 -2px 10px rgba(0,0,0,0.05)',
        })}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isLoading}
          sx={{
            borderRadius: '16px',
            textTransform: 'none',
            fontSize: { xs: '13px', sm: '14px' },
            fontWeight: 500,
            border: (theme) => `0.8px solid ${theme.palette.divider}`,
            color: 'text.primary',
            minWidth: { xs: '80px', sm: 'auto' },
            px: { xs: 1.5, sm: 2 },
            '&:hover': {
              border: (theme) => `0.8px solid ${theme.palette.divider}`,
            },
          }}
        >
          Hủy
        </Button>
        <Button
          startIcon={<CheckCircleIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
          onClick={handleFormSubmit(handleSubmit)}
          disabled={isLoading}
          sx={{
            background: COLORS.gradientPrimary,
            color: '#FAFAFA',
            borderRadius: '16px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '6px 12px',
            height: '36px',
            px: { xs: 1.5, sm: 2 },
            minWidth: { xs: '120px', sm: 'auto' },
            fontSize: { xs: '13px', sm: '14px' },
            '&:hover': {
              background: COLORS.gradientPrimary,
              opacity: 0.9,
            },
          }}
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu hóa đơn'}
        </Button>
      </Box>

      {/* Add Participant Dialog */}
      <AddParticipantDialog
        open={openParticipantDialog}
        onClose={() => setOpenParticipantDialog(false)}
        onAdd={handleAddParticipants}
        onRemove={handleDeleteParticipant}
        currentParticipants={participants}
        availablePeople={availablePeople}
        availableGroups={availableGroups}
        isLoading={isLoadingData}
        onSearch={handleSearch}
        onLoadMore={handleLoadMore}
        searchedUsers={searchedUsers}
        searchedGroups={searchedGroups}
        searchPagination={searchPagination}
        normalPagination={normalPagination}
        isLoadingSearch={isLoadingSearch}
      />

      {/* Select Payer Dialog */}
      <SelectPayerDialog
        open={openPayerDialog}
        onClose={() => setOpenPayerDialog(false)}
        onSelect={(person) => setValue('payer', person.id)}
        availablePeople={participants}
        isLoading={isLoadingData}
      />
    </Box>
  )
}

export default BillCreate
