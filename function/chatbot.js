const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
  const { query } = JSON.parse(event.body);
  const dbUrl = 'https://raw.githubusercontent.com/Opensense21/Chatbot-PHTH/refs/heads/main/database.json'; // Replace with your URL
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    // Fetch the database
    const dbResponse = await fetch(dbUrl);
    const database = await dbResponse.json();

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a prompt with database content
    const prompt = `You are an AI assistant that answers based only on this database content. Do not use external knowledge. If the answer isn’t in the database, say so.\n\nDatabase content:\n${JSON.stringify(database, null, 2)}\n\nUser query: ${query}`;

    // Get AI response
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ response })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ response: 'Sorry, there was an error processing your request.' })
    };
  }
};
