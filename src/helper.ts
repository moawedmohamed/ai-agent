import { OpenRouter } from "@openrouter/sdk";

type ChatMessages = {
    role: string, content: string
}

interface IPrams {
    messages: ChatMessages[],
    toolChoice: "required" | "auto",
}

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("Set OPENROUTER_API_KEY before running this example");
}

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});
let messages: ChatMessages[] = [
    {
        role: "user",
        content: "What is the weather in London right now?",
    },
];


const sendTurn = async ({ messages, toolChoice }: IPrams) => {
    const result = await openRouter.chat.send({
        chatRequest: {
            model,
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

