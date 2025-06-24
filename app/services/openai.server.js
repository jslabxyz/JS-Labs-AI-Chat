/**
 * OpenAI Service
 * Manages interactions with the OpenAI API
 */
import OpenAI from "openai";
import AppConfig from "./config.server.js";
import systemPrompts from "../prompts/prompts.json" assert { type: "json" };

/**
 * Creates an OpenAI service instance
 * @param {string} apiKey - OpenAI API key
 * @returns {Object} OpenAI service with methods for interacting with OpenAI API
 */
export function createOpenAIService(apiKey = process.env.OPENAI_API_KEY) {
  // Initialize OpenAI client
  const openai = new OpenAI({ apiKey });

  /**
   * Streams a conversation with OpenAI
   * @param {Object} params - Stream parameters
   * @param {Array} params.messages - Conversation history
   * @param {string} params.promptType - The type of system prompt to use
   * @param {Array} params.tools - Available tools for OpenAI
   * @param {Object} streamHandlers - Stream event handlers
   * @param {Function} streamHandlers.onText - Handles text chunks
   * @param {Function} streamHandlers.onMessage - Handles complete messages
   * @param {Function} streamHandlers.onToolUse - Handles tool use requests
   * @returns {Promise<Object>} The final message
   */
  const streamConversation = async ({
    messages,
    promptType = AppConfig.api.defaultPromptType,
    tools
  }, streamHandlers) => {
    // Get system prompt from configuration or use default
    const systemInstruction = getSystemPrompt(promptType);

    // Convert messages to OpenAI format
    const openaiMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: typeof msg.content === 'string' ? msg.content : 
                 Array.isArray(msg.content) ? 
                   msg.content.map(c => c.type === 'text' ? c.text : JSON.stringify(c)).join('\n') :
                   JSON.stringify(msg.content)
      }))
    ];

    // Convert tools to OpenAI format if provided
    const openaiTools = tools && tools.length > 0 ? tools.map(tool => ({
      type: "function",
      function: {
        name: tool.name,
        description: `${tool.description}\n\nUse this tool when customers ask about: ${getToolKeywords(tool.name)}`,
        parameters: tool.input_schema
      }
    })) : undefined;

    try {
      // Create stream
      const stream = await openai.chat.completions.create({
        model: AppConfig.api.defaultModel,
        max_tokens: AppConfig.api.maxTokens,
        messages: openaiMessages,
        tools: openaiTools,
        stream: true
      });

      let fullContent = '';
      let toolCalls = [];
      let currentToolCall = null;

      // Process the stream
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        
        if (delta?.content) {
          // Handle text content
          fullContent += delta.content;
          if (streamHandlers.onText) {
            streamHandlers.onText(delta.content);
          }
        }

        if (delta?.tool_calls) {
          // Handle tool calls
          for (const toolCall of delta.tool_calls) {
            if (toolCall.index !== undefined) {
              if (!toolCalls[toolCall.index]) {
                toolCalls[toolCall.index] = {
                  id: toolCall.id || `call_${Date.now()}_${toolCall.index}`,
                  type: 'function',
                  function: { name: '', arguments: '' }
                };
              }
              
              const currentCall = toolCalls[toolCall.index];
              
              if (toolCall.function?.name) {
                currentCall.function.name += toolCall.function.name;
              }
              if (toolCall.function?.arguments) {
                currentCall.function.arguments += toolCall.function.arguments;
              }
            }
          }
        }

        // Check if chunk is done
        if (chunk.choices[0]?.finish_reason) {
          break;
        }
      }

      // Create final message
      const finalMessage = {
        role: 'assistant',
        content: fullContent ? [{ type: 'text', text: fullContent }] : [],
        stop_reason: 'end_turn'
      };

      // Add tool calls to content if any
      if (toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          if (toolCall.function.name && toolCall.function.arguments) {
            try {
              const args = JSON.parse(toolCall.function.arguments);
              finalMessage.content.push({
                type: 'tool_use',
                id: toolCall.id,
                name: toolCall.function.name,
                input: args
              });
            } catch (e) {
              console.error('Error parsing tool arguments:', e);
            }
          }
        }
      }

      // Call message handler
      if (streamHandlers.onMessage) {
        streamHandlers.onMessage(finalMessage);
      }

      // Process tool use requests
      if (streamHandlers.onToolUse && finalMessage.content) {
        for (const content of finalMessage.content) {
          if (content.type === "tool_use") {
            await streamHandlers.onToolUse(content);
          }
        }
      }

      return finalMessage;

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  };

  /**
   * Gets the system prompt content for a given prompt type
   * @param {string} promptType - The prompt type to retrieve
   * @returns {string} The system prompt content
   */
  const getSystemPrompt = (promptType) => {
    return systemPrompts.systemPrompts[promptType]?.content ||
      systemPrompts.systemPrompts[AppConfig.api.defaultPromptType].content;
  };

  /**
   * Gets keywords that should trigger tool usage
   * @param {string} toolName - The tool name
   * @returns {string} Keywords for when to use this tool
   */
  function getToolKeywords(toolName) {
    const keywords = {
      'search_shop_catalog': 'products, search, find, looking for, show me, what do you have, inventory, items, merchandise',
      'get_cart': 'cart, shopping cart, what\'s in my cart, cart contents, my items',
      'update_cart': 'add to cart, remove from cart, add item, buy, purchase, shopping',
      'search_shop_policies_and_faqs': 'shipping, returns, policy, FAQ, delivery, refund, exchange, terms',
      'get_most_recent_order_status': 'my orders, order history, recent orders, past purchases',
      'get_order_status': 'order status, track order, order details, order number',
      'initiate_return': 'return, refund, exchange, send back'
    };
    return keywords[toolName] || 'general inquiries';
  }

  return {
    streamConversation,
    getSystemPrompt
  };
}

export default {
  createOpenAIService
};