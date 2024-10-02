import "dotenv/config";
import path from "path";
import {
  RAGApplicationBuilder,
  SIMPLE_MODELS,
  OpenAi,
  WebLoader,
} from "@llm-tools/embedjs";
import { LanceDb } from "@llm-tools/embedjs/vectorDb/lance";

/**
 * Retrieves the prompt based on the command line arguments.
 * If no arguments are provided, a default prompt is returned.
 * @returns {string} The prompt to be used.
 */


/**
 * Retrieves the RAG application with the specified configuration.
 * @returns {Promise<RAGApplication>} The RAG application.
 */
const getRagApplication = async () => {
  console.log("Getting RAG application...");

  const ragApplication = await new RAGApplicationBuilder()
    .setModel(new OpenAi({ modelName: 'gpt-4' }))
    .setSearchResultCount(10)
    .setVectorDb(new LanceDb({ path: path.resolve("./db") }))
    .addLoader(new WebLoader({ urlOrContent: "https://github.com" }))
    .build();

  console.log("Built RAG application with: ", ragApplication.model.modelName);

  return ragApplication;
};

/**
 * Prints the output of the RAG query.
 * @param {Object} output - The output object containing the result and sources.
 */
const printOutput = (output) => {
  console.log(`
    ${output.result}

    Sourced from:
    ${output.sources.map((url) => "-" + url).join("\n")}
  `);
};

/**
 * The main function that executes the RAG query.
 */
const main = async () => {
  const ragApplication = await getRagApplication();
  const res = await ragApplication.query("What is GitHub?");
  console.log(res)
};

main();
