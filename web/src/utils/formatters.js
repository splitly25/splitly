export const captializeFirstLetter = (string) => {
  if (!string || typeof string !== 'string') return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
}

export const interceptorLoadingElements = (calling) => {

  const elements = document.querySelectorAll('.interceptor-loading')

  for (let i=0;i < elements.length; ++i)
  {
    if (calling) {
      elements[i].computedStyleMap.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    }
    else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}