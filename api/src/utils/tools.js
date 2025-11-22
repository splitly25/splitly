export const allRequestTypes = [
    {
        name: "create_new_bill",
        description: "tạo hóa đơn mới",
        prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When the user asks you to create a new bill without providing enough information, request that the user supply all required bill details: bill name, payment deadline, bill-splitting method (split evenly, split by person, split by item), names or emails of the participants, and the total amount of the bill. When the user asks you to create a new bill with complete information, use the tool search_participants_by_key to find user information based on the provided names or emails, use the tool get_current_user to retrieve the current user's information, and use the tool create_new_bill to create the bill from the information the user provided. Provide concise results for the bills you create. Always maintain a positive, friendly, and approachable attitude. All of your responses must always be in Vietnamese in plain-text format. If you do not have the relevant information to answer the user's question, remain polite and apologize for not knowing the information needed to respond."
    },
    {
        name: "introduce_features",
        description: "giới thiệu các tính năng của TingTing",
        prompt: "You are TingTing, a helpful assistant for managing shared expense bills. You can help users create new bills through messages or by scanning receipts. You can inform users and remind them about the payment status of their bills and their friends' bills. You can also provide suggestions to help users spend and settle bills more effectively. Let them know who you are. Always maintain a positive, friendly, and sociable attitude. All of your responses must always be in Vietnamese plain text. If you do not have the information needed to answer a user's question, remain polite and apologize for not having the necessary information to respond."
    },
    {
        name: "provide_bill_status",
        description: "cung cấp tình hình hóa đơn của người dùng",
        prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When you receive a provide_bill_status request, use the analysis_by_assistant tool to analyze the user's bills, payment status, and activity history, and then provide them with some personalized advice. Always maintain a positive, friendly, and sociable attitude. All of your responses must always be in Vietnamese plain text. If you do not have the information needed to answer the user's question, remain polite and apologize for not having the necessary information to respond."
        
    },
    {
        name: "answer_the_question",
        description: "trả lời câu hỏi chung",
        prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When you receive an answer_the_questions request, use the most appropriate tools to answer the user’s questions. Always maintain a positive, friendly, and sociable attitude. All of your responses must always be in Vietnamese plain text. If you do not have the information needed to answer the user’s question, remain polite and apologize for not having the necessary information to respond."
    },
    {
        name: "suggest_payers",
        description: "gợi ý người thanh toán hôm nay",
        prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When you receive a suggest_payers request, use the suggest_payers tool to find people who are likely to pay or should pay the bill today to balance the amount they owe you. Always maintain a positive, friendly, and sociable attitude. All of your responses must always be in Vietnamese plain text. If you do not have the information needed to answer the user's question, remain polite and apologize for not having the necessary information to respond."
    },
    {
        name: "unknown",
        description: "không xác định được yêu cầu",
        prompt: "You are TingTing, a helpful assistant for managing shared expense bills. You do not know what the user is requesting and you also have no information to respond with, so please remain polite and apologize for not knowing the information needed to answer. All of your responses must always be in Vietnamese in plain text."
    }
]

export const categorizeRequestTool = {
    type: "function",
    function: {
        name: "categorize_request",
        description: "Phân loại yêu cầu của người dùng để xác định xem họ đang muốn thực hiện yêu cầu gì. Sử dụng công cụ này trước khi quyết định sử dụng công cụ nào khác.",
        parameters: {
            type: "object",
            properties: {
                requestType: {
                    type: "string",
                    description: `Loại yêu cầu của người dùng. Các loại yêu cầu bao gồm: ${allRequestTypes.map(request => `"${request.name}" - ${request.description}`).join(", ")}.`,
                    enum: [...allRequestTypes.map(request => request.name)],
                }
            },
            required: ["requestType"],
        }
    }
};

export const createBillTool = {
    type: "function",
    function: {
        name: "create_new_bill",
        description: "Tạo hóa đơn mới từ những thông tin mà người dùng cung cấp.",
        parameters: {
            type: "object",
            properties: {
                billName: {
                    type: "string",
                    description: "Tên của hóa đơn, ví dụ: 'Bữa tối tại nhà hàng ABC'.",
                },
                category: {
                    type: "string",
                    description: "Danh mục của hóa đơn, ví dụ: 'food', 'utilities', 'entertainment', 'transportation', 'shopping', 'others'.",
                    enum: ["food", "utilities", "entertainment", "transportation", "shopping", "others"],
                },
                notes: {
                    type: "string",
                    description: "Ghi chú bổ sung cho hóa đơn."
                },
                creationDate: {
                    type: "string",
                    format: "date-time",
                    description: "Ngày tạo hóa đơn theo định dạng ISO 8601."
                },
                paymentDeadline: {
                    type: "string",
                    format: "date-time",
                    description: "Hạn chót thanh toán hóa đơn theo định dạng ISO 8601."
                },
                payer: {
                    type: "string",
                    description: "ID của người đã thanh toán hóa đơn. Cần sử dụng công cụ search_participants_by_key. Mặc định là ''"
                },
                splitType: {
                    type: "string",
                    description: "Loại hình chia hóa đơn. Mặc định là 'equal' (chia đều).",
                    enum: ['equal', 'item-based', 'people-based'],
                },
                totalAmount: {
                    type: "number",
                    description: "Tổng số tiền của hóa đơn."
                },
                items: {
                    type: "array",
                    description: "Danh sách các món hàng trong hóa đơn. Bắt buộc khi 'splitType' là 'item-based'.",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "Tên món hàng." },
                            amount: { type: "number", description: "Giá của món hàng." },
                            quantity: { type: "number", description: "Số lượng món hàng." },
                            allocatedTo: {
                                type: "array",
                                description: "Danh sách ID của những người tham gia thanh toán cho món hàng này. Cần sử dụng công cụ search_participants_by_key.",
                                items: { type: "string" }
                            }
                        }
                    }
                },
                participants: {
                    type: "array",
                    description: "Danh sách những người tham gia chia hóa đơn.",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "ID định danh của người tham gia. Cần sử dụng công cụ search_participants_by_key." },
                            name: { type: "string", description: "Tên của người tham gia." },
                            email: { type: "string", description: "Email của người tham gia." },
                            amount: {
                                type: "number",
                                description: "Số tiền cụ thể người này phải trả (sử dụng khi 'splitType' là 'people-based')."
                            }
                        }
                    }
                }
            },
            required: ["billName", "splitType", "totalAmount", "category", "notes"],
        }
    }
};

export const searchPaticipantsByKeyTool = {
    type: "function",
    function: {
        name: "search_participants_by_key",
        description: "Tìm kiếm và lấy thông tin chi tiết của những người tham gia dựa trên một danh sách các từ khóa. Sử dụng công cụ này để xác định những người tham gia trước khi tạo hóa đơn hoặc khi được yêu cầu.",
        parameters: {
            type: "object",
            properties: {
                participantsKey: {
                    type: "array",
                    description: "Danh sách các từ khóa để tìm kiếm những người tham gia. Từ khóa có thể là email, tên đầy đủ, hoặc tên người dùng.",
                    items: {
                        type: "string",
                    }
                }
            },
            required: ["participantsKey"],
        }
    }
};

export const getCurrentUserTool = {
    type: "function",
    function: {
        name: "get_current_user",
        description: "Tìm kiếm và lấy thông tin chi tiết của người yêu cầu. Sử dụng công cụ này để xác định những người tham gia trước khi tạo hóa đơn hoặc khi được yêu cầu.",
        parameters: {
            type: "object",
            properties: {
                isFullData: {
                    type: "boolean",
                    description: "Nếu muốn thấy đầy đủ thông tin thì true. Nếu chỉ cần _id thì false. Mặc định là true.",
                }
            }
        }
    }
}

export const analysisByAssistantTool = {
    type: "function",
    function: {
        name: "analysis_by_assistant",
        description: "Phân tích các hóa đơn, tình trạng thanh toán và lịch sử hoạt động của người dùng để cung cấp lời khuyên cá nhân hóa.",
        parameters: {
            type: "object",
            properties: {
                isFullData: {
                    type: "boolean",
                    description: "Nếu muốn thấy đầy đủ thông tin thì true. Nếu chỉ cần _id thì false. Mặc định là true.",
                }}
        }
    }
}

export const suggestPayersTool = {
    type: "function",
    function: {
        name: "suggest_payers",
        description: "Tìm những người có khả năng sẽ thanh toán hoặc nên thanh toán hóa đơn hôm nay để cân bằng số tiền họ nợ bạn.",
        parameters: {
            type: "object",
            properties: {
                isFullData: {
                    type: "boolean",
                    description: "Nếu muốn thấy đầy đủ thông tin thì true. Nếu chỉ cần _id thì false. Mặc định là true.",
                }
            }
        }
    }
};

export const allTools = [
    categorizeRequestTool,
    createBillTool,
    searchPaticipantsByKeyTool,
    getCurrentUserTool,
    analysisByAssistantTool,
    suggestPayersTool
];