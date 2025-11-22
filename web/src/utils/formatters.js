import { categoryOptions } from "./constants"

export const captializeFirstLetter = (string) => {
  if (!string || typeof string !== 'string') return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
}

export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading')

  for (let i = 0; i < elements.length; ++i) {
    if (calling) {
      elements[i].computedStyleMap.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}

// helper function to get initials from name
// ex: "John Doe" -> "JD", "Alice" -> "AL"
export const getInitials = (name) => {
  if (!name) return 'NA'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// helper remove leading 0
export const removeLeadingZeros = (value) => {
  if (typeof value !== 'string') return value
  return value.replace(/^0+(?=\d)/, '')
}

export const getCategoryLabel = (category) => {
    const option = categoryOptions.find((option) => option.value === category)
    return option ? option.label : ''
  }
