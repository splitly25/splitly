/**
 * Clean and fix common JSON formatting issues
 * 
 * @param {string} jsonString - Potentially malformed JSON string
 * @returns {string} Cleaned JSON string
 */
const cleanJSONString = (jsonString) => {
  let cleaned = jsonString.trim()

  // Remove comments (// and /* */)
  cleaned = cleaned.replace(/\/\/.*$/gm, '') // Single line comments
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments

  // Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1')

  // Fix numbers with thousand separators (55,000 -> 55000)
  // Match : 123,456 or : 123,456.78 (but not in strings)
  cleaned = cleaned.replace(/:\s*(\d{1,3}(,\d{3})+(\.\d+)?)/g, (match, num) => {
    return ': ' + num.replace(/,/g, '')
  })

  // Replace single quotes with double quotes for property names
  cleaned = cleaned.replace(/(['"])([a-zA-Z_$][a-zA-Z0-9_$]*)\1\s*:/g, '"$2":')

  // Replace single quotes with double quotes for string values
  cleaned = cleaned.replace(/:\s*'([^'\\]*(\\.[^'\\]*)*)'/g, (match, p1) => {
    return ':"' + p1.replace(/\\'/g, "'").replace(/"/g, '\\"') + '"'
  })

  return cleaned
}

/**
 * Parse markdown JSON to JavaScript object
 * Supports multiple formats:
 * 1. Markdown code block: ```json { ... } ```
 * 2. Code block without language: ``` { ... } ```
 * 3. Plain JSON string
 * 4. Attempts to fix common JSON errors
 * 
 * @param {string} rawData - Raw string data from API response
 * @returns {Object|null} Parsed JSON object or null if parsing fails
 * @throws {Error} If parsing fails with detailed error message
 */
export const parseMarkdownJSON = (rawData) => {
  if (!rawData || typeof rawData !== 'string') {
    throw new Error('Invalid input: rawData must be a non-empty string')
  }

  let jsonString = rawData.trim()

  try {
    // Extract from markdown code block
    const jsonMarkdownMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMarkdownMatch && jsonMarkdownMatch[1]) {
      jsonString = jsonMarkdownMatch[1].trim()
    }

    // Try parsing directly first
    try {
      return JSON.parse(jsonString)
    } catch (firstError) {
      // If direct parse fails, try cleaning the JSON
      console.warn('Direct JSON parse failed, attempting to clean...', firstError.message)
      const cleanedJSON = cleanJSONString(jsonString)
      console.log('Cleaned JSON (first 800 chars):', cleanedJSON.substring(0, 800))
      return JSON.parse(cleanedJSON)
    }
  } catch (error) {
    console.error('Error parsing JSON after all attempts:', error)
    console.error('Raw data (first 500 chars):', rawData.substring(0, 500))
    console.error('Extracted JSON string (first 500 chars):', jsonString.substring(0, 500))
    throw new Error(`Failed to parse JSON: ${error.message}`)
  }
}

/**
 * Parse assistant response and extract bill data
 * Handles various response formats and provides fallback values
 * 
 * @param {string} rawContent - Raw content from assistant API
 * @returns {Object} Formatted bill data object
 */
export const parseAssistantBillData = (userId, rawContent) => {
  try {
    const parsedData = parseMarkdownJSON(rawContent)

    // Validate required fields
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Parsed data is not a valid object')
    }

    // Return formatted bill data with fallbacks
    return {
      billName: parsedData.billName || parsedData.name || 'Hóa đơn mới',
      category: parsedData.category || 'other',
      notes: parsedData.notes || parsedData.description || parsedData.note || '',
      totalAmount: parseFloat(parsedData.totalAmount || parsedData.total || 0),
      splitType: parsedData.splitType || parsedData.splittingMethod || 'by-item',
      participants: Array.isArray(parsedData.participants) ? parsedData.participants : [],
      payer: parsedData.payer || parsedData.payerId || userId,
      items: Array.isArray(parsedData.items) ? parsedData.items : [],
      creationDate: dateStringToISO(parsedData.paymentDate),
      paymentDeadline: '',
    }
  } catch (error) {
    console.error('Error parsing assistant bill data:', error)
    throw new Error(`Cannot parse bill data from assistant: ${error.message}`)
  }
}

/**
 * Convert date string from "dd/mm/yyyy" format to Date object
 * Also handles various date formats for flexibility
 * 
 * @param {string} dateString - Date string in format "dd/mm/yyyy" or other formats
 * @returns {Date|null} Date object or null if parsing fails
 */
export const parseDateString = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null
  }

  try {
    // Remove extra whitespace
    const trimmed = dateString.trim()

    // Pattern 1: dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy
    const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/)
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      
      // Validate the date is valid
      if (!isNaN(date.getTime())) {
        return date
      }
    }

    // Pattern 2: yyyy-mm-dd (ISO format)
    const isoMatch = trimmed.match(/^(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})$/)
    if (isoMatch) {
      const [, year, month, day] = isoMatch
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      
      if (!isNaN(date.getTime())) {
        return date
      }
    }

    // Pattern 3: Try native Date parse as fallback
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return date
    }

    return null
  } catch (error) {
    console.error('Error parsing date string:', error)
    return null
  }
}

/**
 * Convert date string to ISO format for API
 * 
 * @param {string} dateString - Date string in various formats
 * @returns {string} ISO date string or current date if parsing fails
 */
export const dateStringToISO = (dateString) => {
  const date = parseDateString(dateString)
  return date ? date.toISOString() : new Date().toISOString()
}

/**
 * Format Date object to "dd/mm/yyyy" string
 * 
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string "dd/mm/yyyy"
 */
export const formatDateToDDMMYYYY = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// json to markdown
export const jsonToMarkdown = (jsonObject) => {
  const jsonString = JSON.stringify(jsonObject, null, 2)
  return `\`\`\`json\n${jsonString}\n\`\`\``
}