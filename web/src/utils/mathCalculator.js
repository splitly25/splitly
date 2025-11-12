/**
 * evaluateMathExpression("100+200+300") // 600
 * evaluateMathExpression("50*3") // 150
 * evaluateMathExpression("1000/4") // 250
 * evaluateMathExpression("(100+50)*2") // 300
 */
export const evaluateMathExpression = (expression) => {
  if (!expression || typeof expression !== 'string') {
    return null
  }

  // Remove spaces
  const cleanExpression = expression.trim().replace(/\s+/g, '')

  // Check if it's already a plain number (including those with leading zeros like 0.5 or 012)
  if (/^0*\d+(\.\d+)?$/.test(cleanExpression)) {
    return parseFloat(cleanExpression)
  }

  // Check if expression contains valid math operators (including decimals starting with 0)
  if (!/^[\d+\-*/.()]+$/.test(cleanExpression)) {
    return null
  }

  // Check for dangerous patterns
  if (cleanExpression.includes('..') || /[^\d+\-*/.()]/.test(cleanExpression)) {
    return null
  }

  try {
    // Use Function constructor for safe evaluation (safer than eval)
    const result = new Function(`'use strict'; return (${cleanExpression})`)()

    // Validate result is a finite number
    if (typeof result === 'number' && isFinite(result)) {
      // Round to 2 decimal places
      return Math.round(result * 100) / 100
    }

    return null
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return null
  }
}
