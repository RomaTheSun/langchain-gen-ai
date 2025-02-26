import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { config } from "dotenv";

config()
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

const messages = [
  new SystemMessage("Translate the following from English into Ukrainian"),
  new HumanMessage("hi!"),
];

const stream = await model.stream(messages);

const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
  console.log(`${chunk.content}|`);
}

const response = chunks.map((chunk) => chunk.content).join("");
console.log(response);
