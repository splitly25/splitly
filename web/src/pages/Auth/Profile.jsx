import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUserProfileAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

// Layout
import Layout from '~/components/Layout'
import { Typography } from '@mui/material'
import { Box, Avatar } from '@mui/material'
import { Phone, Wallet, AccountBalance, Person, Create } from '@mui/icons-material'

function Profile() {
  const hoverGradient = 'linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%)'

  const dispatch = useDispatch()
  const userFromStore = useSelector(selectCurrentUser)
  console.log(userFromStore);
  const [currentUser, setCurrentUser] = useState(userFromStore)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    name: userFromStore?.name || '',
    phone: userFromStore?.phone || '',
    bankAccount: userFromStore?.bankAccount || '',
    bankName: userFromStore?.bankName || '',
  })

  useEffect(() => {
    setCurrentUser(userFromStore)
    setFormData({
      name: userFromStore?.name || '',
      phone: userFromStore?.phone || '',
      bankAccount: userFromStore?.bankAccount || '',
      bankName: userFromStore?.bankName || '',
    })
  }, [userFromStore, dispatch])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      bankAccount: currentUser?.bankAccount || '',
      bankName: currentUser?.bankName || '',
    })
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || formData.name.trim() === '') {
        toast.error('Họ tên không được để trống')
        return
      }

      // Call API to update user profile
      const result = await dispatch(
        updateUserProfileAPI({
          userId: currentUser._id,
          profileData: formData,
        })
      ).unwrap()
      console.log(result)

      // Update local state with the result from Redux
    //   setCurrentUser(result)
      
      setIsEditing(false)
      toast.success('Cập nhật thông tin thành công!')
      
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  return (
    <Layout>
      <Box className="main-container">
        <Box className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Hồ sơ cá nhân</h1>
          <Typography className="text-sm sm:text-base text-gray-500">Quản lý thông tin cá nhân của bạn</Typography>
        </Box>

        <Box className="mb-6 bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <Box className="flex flex-col items-center justify-center">
            <Avatar
              sx={{
                width: { sm: 32, md: 64 },
                height: { sm: 32, md: 64 },
                background: hoverGradient,
                fontSize: { sm: '1.25rem', md: '1.5rem' },
                fontWeight: 700,
              }}
            >
              {currentUser?.name.charAt(0).toUpperCase()}
            </Avatar>
            <div className="text-[1.25rem] md:text-[1.5rem] font-bold">{currentUser?.name}</div>
            <div className="text-base md:text-lg text-gray-700">{currentUser?.email}</div>
          </Box>
        </Box>

        <Box className="mb-6 bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base">Thông tin chi tiết</h3>
            {!isEditing && (
              <button onClick={handleEdit} className="flex gap-1 items-center font-bold">
                <Create sx={{ color: 'black', width: 18, height: 18 }} />
                Chỉnh sửa
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ tên */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <Person sx={{ color: '#9E9E9E', width: 24, height: 24 }} />
                <p className="text-gray-500">Họ tên</p>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="p-2 border border-gray-200 rounded-4xl shadow-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!isEditing}
              />
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <Phone sx={{ color: '#9E9E9E', width: 24, height: 24 }} />
                <p className="text-gray-500">Số điện thoại</p>
              </div>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="p-2 border border-gray-200 rounded-4xl shadow-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!isEditing}
              />
            </div>

            {/* Số tài khoản */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <Wallet sx={{ color: '#9E9E9E', width: 24, height: 24 }} />
                <p className="text-gray-500">Số tài khoản</p>
              </div>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                className="p-2 border border-gray-200 rounded-4xl shadow-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!isEditing}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <AccountBalance sx={{ color: '#9E9E9E', width: 24, height: 24 }} />
                <p className="text-gray-500">Tên ngân hàng</p>
              </div>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="p-2 border border-gray-200 rounded-4xl shadow-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg font-bold text-white transition-all hover:shadow-lg"
                style={{ background: hoverGradient }}
              >
                Xác nhận
              </button>
            </div>
          )}
        </Box>
      </Box>
    </Layout>
  )
}

export default Profile
