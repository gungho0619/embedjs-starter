import "dotenv/config";
import path from "path";
import {
  RAGApplicationBuilder,
  OpenAi,
  WebLoader,
  PdfLoader
} from "@llm-tools/embedjs";
import { LanceDb } from "@llm-tools/embedjs/vectorDb/lance";

/**
 * Retrieves the RAG application with the specified configuration.
 * @returns {Promise<RAGApplication>} The RAG application.
 */
const getRagApplication = async () => {
  try {
    console.log("Getting RAG application...");

    // Using the URL for the PDF file
    const pdfUrl = 'https://gungho0619.vercel.app/resume.pdf';

    const ragApplication = await new RAGApplicationBuilder()
      .setModel(new OpenAi({ modelName: 'gpt-4' }))  // Using GPT-4 model
      .setVectorDb(new LanceDb({ path: path.resolve("./db") }))  // Vector database path
      .addLoader(new WebLoader({ urlOrContent: 'https://gungho0619.vercel.app/' }))
      .addLoader(new PdfLoader({ filePathOrUrl: pdfUrl }))  // Loading the PDF from URL
      .build();

    console.log("Built RAG application with:", ragApplication.model.modelName);
    return ragApplication;
  } catch (error) {
    console.error("Error while getting RAG application:", error);
    throw error;
  }
};

/**
 * The main function that executes the RAG query.
 */
const main = async () => {
  try {
    const ragApplication = await getRagApplication();  // Get the RAG app instance
    console.log("Querying the RAG application...");

    // Query the model with a fixed prompt
    const res = await ragApplication.query("what's the Hose Address of Akira?");
    console.log("Response:", res);
  } catch (error) {
    console.error("Error during the RAG query execution:", error);
  }
};

// Run the main function
main();
