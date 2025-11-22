import { evaluateMathExpression } from "~/utils/mathCalculator"

/**
 * Custom hook for handling auto-calculation in input fields
 * Automatically evaluates math expressions when user leaves the field (onBlur)
 *
 * Supported operations: +, -, *, /, (), k (thousands)
 *
 * @param {string|number} value - Current input value
 * @param {function} onChange - Callback function to update the value with calculated result
 * @returns {object} - Object containing handleBlur function
 *
 * @example
 * const autoCalc = useAutoCalculate(amount, setAmount)
 * <input value={amount} onBlur={autoCalc.handleBlur} />
 * // User types "100+200+300" and leaves field → becomes 600
 * // User types "65k" and leaves field → becomes 65000
 * // User types "50k+15k" and leaves field → becomes 65000
 */
export const useAutoCalculate = (value, onChange) => {
  const handleBlur = (e) => {
    const inputValue = e.target.value

    // Only try to calculate if the value contains operators or 'k' suffix
    if (inputValue && (/[+\-*/]/.test(inputValue) || /\d[kK]/.test(inputValue))) {
      const result = evaluateMathExpression(inputValue)

      if (result !== null) {
        onChange(result)
      }
    }
  }

  return { handleBlur }
}