import { OpenRouter } from "@openrouter/sdk"
import type { ChatMessages, ChatToolCall } from "@openrouter/sdk/models";

if (!process.env.OPENROUTER_API_KEY)
    throw new Error("Set OPENROUTER_API_KEY before running this example")
const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

const models = [
    "google/gemini-3-flash-preview",
    "nvidia/nemotron-3.5-lightning",
];


const tools = [
    {
        type: "function" as const,
        function: {
            name: "get_weather",
            description: "Get local sample weather data for Lagos or London",
            parameters: {
                type: "object",
                properties: {
                    city: { type: "string", enum: ["Lagos", "London"] }

                },
                required: ["city"],
                additionalProperties: false,

            }
        }
    }
]
const weatherByCity: Record<
    string,
    { temperatureC: number; conditions: string }
> = {
    lagos: { temperatureC: 29, conditions: "partly cloudy" },
    london: { temperatureC: 18, conditions: "overcast" },
}




type ChatMessages = {
    role: string, content: string
}

interface IPrams {
    messages: ChatMessages[],
    toolChoice: "required" | "auto",
}



const sendTurn = async (messages: ChatMessages[],
    toolChoice: "required" | "auto",) => {
    const result = await openRouter.chat.send({
        chatRequest: {
            models,
            messages,
            tools,
            toolChoice,
            maxCompletionTokens: 1024,
            stream: false,
        }
    })
    if (!("choices" in result)) {
        throw new Error("Expected a non-streaming response");
    }
    const message = result.choices[0]?.message;
    if (!message) throw new Error("The model returned no message");
    return {
        result,
        message,
        calls: message.toolCalls ?? [],
    };
}


async function executeToolCall(call: ChatToolCall): Promise<ChatMessages> {
    let context:string;
    try{
    
}catch(error){}
}
