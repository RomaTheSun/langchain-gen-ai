import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { config } from "dotenv";

config()
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

// Define the function that calls the model
const callModel = async (state) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const conf = { configurable: { thread_id: uuidv4() } };

const input = [
  {
    role: "user",
    content: "Hi! I'm Bob.",
  },
];
const output = await app.invoke({ messages: input }, conf);
// The output contains all messages in the state.
// This will log the last message in the conversation.
console.log(output.messages[output.messages.length - 1]);

const input2 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
const output2 = await app.invoke({ messages: input2 }, conf);
console.log(output2.messages[output2.messages.length - 1]);

const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
const output3 = await app.invoke({ messages: input3 }, config2);
console.log(output3.messages[output3.messages.length - 1]);

const output4 = await app.invoke({ messages: input2 }, conf);
console.log(output4.messages[output4.messages.length - 1]);

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate in Ukrainian. Answer all questions to the best of your ability.",
  ],
  ["placeholder", "{messages}"],
]);

const callModel2 = async (state) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  // Update message history with response:
  return { messages: [response] };
};

// Define a new graph
const workflow2 = new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const app2 = workflow2.compile({ checkpointer: new MemorySaver() });

const config3 = { configurable: { thread_id: uuidv4() } };
const input4 = [
  {
    role: "user",
    content: "Hi! I'm Jim.",
  },
];
const output5 = await app2.invoke({ messages: input4 }, config3);
console.log(output5.messages[output5.messages.length - 1]);
