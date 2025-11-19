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

export const allTools = [
    createBillTool,
    searchPaticipantsByKeyTool,
    getCurrentUserTool
];