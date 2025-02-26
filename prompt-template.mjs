import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";

config()
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
const systemTemplate = "You are a king of {country}!";

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
  country: "France",
  text: "Tell me about your country!",
});

const response = await model.invoke(promptValue);
console.log(`${response.content}`);
