const crypto = require('crypto');

/**
 * ClovaX API Client
 * Handles communication with Naver's ClovaX Chat Completions V3 API
 */
class ClovaXClient {
    /**
     * @param {string} [modelOverride] - Optional model override
     */
    constructor(modelOverride) {
        this.apiKey = process.env.NCP_API_KEY || "";
        this.endpoint = process.env.NCP_CLOVASTUDIO_ENDPOINT || "";

        // Allow overriding the model in the endpoint (e.g., for HCX-005 vision model)
        if (modelOverride && this.endpoint) {
            this.endpoint = this.endpoint.replace(/HCX-[^/]+$/, modelOverride);
        }

        if (!this.apiKey || !this.endpoint) {
            throw new Error(
                "Missing required environment variables: NCP_API_KEY, NCP_CLOVASTUDIO_ENDPOINT"
            );
        }
    }

    /**
     * Generate a unique request ID for tracking
     * @returns {string}
     */
    generateRequestId() {
        return crypto.randomUUID().replace(/-/g, "");
    }

    /**
     * Send a chat completion request to ClovaX
     * @param {Object} request - The completion request with messages and tools
     * @param {Array} request.messages - Array of message objects
     * @param {number} [request.temperature] - Temperature parameter
     * @param {number} [request.topP] - Top P parameter
     * @param {number} [request.repetitionPenalty] - Repetition penalty
     * @param {number} [request.maxTokens] - Maximum tokens
     * @param {boolean} [request.includeAiFilters] - Include AI filters
     * @param {Array} [request.tools] - Optional array of tools
     * @param {string} [request.toolChoice] - Tool choice option
     * @returns {Promise<Object>} The completion response from ClovaX
     */
    async createChatCompletion(request) {
        try {
            const requestId = this.generateRequestId();

            const requestBody = JSON.stringify(request);

            // console.log("=== ACTUAL REQUEST BEING SENT ===");
            // console.log("URL:", this.endpoint);
            // console.log("Headers:", {
            //     "Content-Type": "application/json",
            //     "Authorization": `Bearer ${this.apiKey.substring(0, 10)}...`,
            //     "X-NCP-CLOVASTUDIO-REQUEST-ID": requestId,
            // });
            // console.log("Body length:", requestBody.length);
            // console.log("Body (first 500 chars):", requestBody.substring(0, 500));

            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`,
                    "X-NCP-CLOVASTUDIO-REQUEST-ID": requestId,
                },
                body: requestBody,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `ClovaX API error: ${response.status} ${response.statusText} - ${errorText}`
                );
            }

            const data = await response.json();

            // Check for API-level errors
            if (data.status.code !== "20000") {
                throw new Error(
                    `ClovaX API returned error: ${data.status.code} - ${data.status.message}`
                );
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to call ClovaX API: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Helper method to create a basic chat request with default parameters
     * @param {Array} messages - Array of messages
     * @param {Array} [tools] - Optional array of tools for function calling
     * @returns {Object} Completion request object
     */
    createRequest(messages, tools) {
        const hasTools = tools && tools.length > 0;

        // When using tools, maxTokens is not allowed according to API error
        const request = {
            messages,
            temperature: 0.7,
            topP: 0.8,
            repetitionPenalty: 1.2,
            includeAiFilters: true,
        };

        if (hasTools) {
            request.tools = tools;
            request.toolChoice = "auto";
        } else {
            request.maxTokens = 1000;
        }

        return request;
    }
}

module.exports = { ClovaXClient };
