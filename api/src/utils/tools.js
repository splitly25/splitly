import { analysisByAssistant, suggestPayers } from "./assistantHelpers";

// export const allRequestTypes = [
//     {
//         name: "create_new_bill",
//         description: "create a new bill",
//         prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When the user asks you to create a new bill without providing enough information, request that the user supply all required bill details: bill name, payment deadline, bill-splitting method (split evenly, split by person, split by item), names or emails of the participants, and the total amount of the bill. When the user asks you to create a new bill with complete information, use the tool search_participants_by_key to find user information based on the provided names or emails, and use the tool create_new_bill to create the bill from the information the user provided. Always maintain a positive, friendly, and approachable attitude.",
//     },
//     {
//         name: "introduce_features",
//         description: "introduce TingTing's features",
//         prompt: "You are TingTing, a helpful assistant for managing shared expense bills. You can help users create new bills through messages or by scanning receipts. You can inform users and remind them about the payment status of their bills and their friends' bills. You can also provide suggestions to help users spend and settle bills more effectively. Let them know who you are. Always maintain a positive, friendly, and sociable attitude.",
//     },
//     {
//         name: "provide_bill_status",
//         description: "provide the user's bill status",
//         prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When you are asked about the bill status, you must use the analysis_by_assistant tool to analyze the user's bills, payment status, and activity history, and then provide them with some personalized advice. Always maintain a positive, friendly, and sociable attitude.",
//     },
//     {
//         name: "answer_the_question",
//         description: "answer general questions",
//         prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When you receive an answer_the_questions request, use the most appropriate tools to answer the user's questions. Always maintain a positive, friendly, and sociable attitude.",
//     },
//     // {
//     //     name: "suggest_payers",
//     //     description: "suggest payers for today",
//     //     prompt: "You are TingTing, a helpful assistant for managing shared expense bills. When you receive a suggest_payers request, use the provided data to find people who are likely to pay or should pay the bill today to balance the amount they owe you. Always maintain a positive, friendly, and sociable attitude.",
//     // },
//     {
//         name: "unknown",
//         description: "unable to identify the request",
//         prompt: "You are TingTing, a helpful assistant for managing shared expense bills. You do not know what the user is requesting and you also have no information to respond with, so please remain polite and apologize for not knowing the information needed to answer.",
//     }
// ]


// export const categorizeRequestTool = {
//     type: "function",
//     function: {
//         name: "categorize_request",
//         description: "Classify the user's request to determine what they are trying to do. Use this tool before deciding which other tool to use.",
//         parameters: {
//             type: "object",
//             properties: {
//                 requestType: {
//                     type: "string",
//                     description: `The type of request the user is making. The request types include: ${allRequestTypes.map(request => `"${request.name}" - ${request.description}`).join(", ")}.`,
//                     enum: [...allRequestTypes.map(request => request.name)],
//                 }
//             },
//             required: ["requestType"],
//         }
//     }
// };

// export const createBillTool = {
//     type: "function",
//     function: {
//         name: "create_new_bill",
//         description: "Create a new bill from the information provided by the user.",
//         parameters: {
//             type: "object",
//             properties: {
//                 billName: {
//                     type: "string",
//                     description: "The name of the bill, for example: 'Dinner at ABC Restaurant'.",
//                 },
//                 category: {
//                     type: "string",
//                     description: "The category of the bill, for example: 'food', 'utilities', 'entertainment', 'transportation', 'shopping', 'others'.",
//                     enum: ["food", "utilities", "entertainment", "transportation", "shopping", "others"],
//                 },
//                 notes: {
//                     type: "string",
//                     description: "Additional notes for the bill."
//                 },
//                 creationDate: {
//                     type: "string",
//                     format: "date-time",
//                     description: "The bill creation date in ISO 8601 format."
//                 },
//                 paymentDeadline: {
//                     type: "string",
//                     format: "date-time",
//                     description: "The payment deadline in ISO 8601 format."
//                 },
//                 payer: {
//                     type: "string",
//                     description: "The ID of the person who paid the bill. Requires using the search_participants_by_key tool. Default is ''."
//                 },
//                 splitType: {
//                     type: "string",
//                     description: "The bill-splitting method. Default is 'equal' (split evenly).",
//                     enum: ['equal', 'item-based', 'people-based'],
//                 },
//                 totalAmount: {
//                     type: "number",
//                     description: "The total amount of the bill."
//                 },
//                 items: {
//                     type: "array",
//                     description: "The list of items in the bill. Required when 'splitType' is 'item-based'.",
//                     items: {
//                         type: "object",
//                         properties: {
//                             name: { type: "string", description: "The name of the item." },
//                             amount: { type: "number", description: "The price of the item." },
//                             quantity: { type: "number", description: "The quantity of the item." },
//                             allocatedTo: {
//                                 type: "array",
//                                 description: "The list of participant IDs assigned to this item. Requires using the search_participants_by_key tool.",
//                                 items: { type: "string" }
//                             }
//                         }
//                     }
//                 },
//                 participants: {
//                     type: "array",
//                     description: "The list of participants sharing the bill.",
//                     items: {
//                         type: "object",
//                         properties: {
//                             id: { type: "string", description: "The unique ID of the participant. Requires using the search_participants_by_key tool." },
//                             name: { type: "string", description: "The name of the participant." },
//                             email: { type: "string", description: "The participant's email." },
//                             amount: {
//                                 type: "number",
//                                 description: "The specific amount this participant must pay (used when 'splitType' is 'people-based')."
//                             }
//                         }
//                     }
//                 }
//             },
//             required: ["billName", "splitType", "totalAmount", "category", "notes"],
//         }
//     }
// };

// export const searchPaticipantsByKeyTool = {
//     type: "function",
//     function: {
//         name: "search_participants_by_key",
//         description: "Search for and retrieve detailed information about participants based on a list of keywords. Use this tool to identify participants before creating a bill or whenever needed.",
//         parameters: {
//             type: "object",
//             properties: {
//                 participantsKey: {
//                     type: "array",
//                     description: "A list of keywords used to search for participants. Keywords may include email, full name, or username.",
//                     items: {
//                         type: "string",
//                     }
//                 }
//             },
//             required: ["participantsKey"],
//         }
//     }
// };


// export const analysisByAssistantTool = {
//     type: "function",
//     function: {
//         name: "analysis_by_assistant",
//         description: "Analyze the user's bills, payment status, and activity history to provide personalized advice.",
//         parameters: {
//             type: "object",
//             properties: {
//                 isFullInfo: {
//                     type: "boolean",
//                     description: "Set to true to get full information. Default is true.",
//                 }
//             },
//             required: ["isFullInfo"],
//         }
//     }
// }


// export const suggestPayersTool = {
//     type: "function",
//     function: {
//         name: "suggest_payers",
//         description: "Find people who are likely to pay or should pay the bill today to balance the amount they owe you.",
//         parameters: {
//             type: "object",
//             properties: {
//                 isFullInfo: {
//                     type: "boolean",
//                     description: "Set to true to get full information. Default is true.",
//                 }
//             }
//         }
//     }
// };

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

export const allTools = [
    createBillTool,
    searchPaticipantsByKeyTool,
    // analysisByAssistantTool,
    // suggestPayersTool
];