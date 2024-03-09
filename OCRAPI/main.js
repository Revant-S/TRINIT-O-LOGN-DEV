const { GoogleGenerativeAI } = require("@google/generative-ai");
const { error } = require("console");
const fs = require('fs');
const { ocrSpace } = require('ocr-space-api-wrapper');
const genAI = new GoogleGenerativeAI("GEMINI API KEY");

let res1 ;
async function main() {
  try {
    // Using your personal API key + local file
     res1 = await ocrSpace('jeepaper12.pdf', { apiKey: 'OCR_APIKEY', OCREngine: '2', filetype: 'PDF' });
     const model = genAI.getGenerativeModel({ model: "gemini-pro"});

     const prompt = `THIS IS THE DATA ${res1.ParsedResults[0].ParsedText}. Exrtact  questions and options. You have to give me this data in a proper JSON format following these rules. Questions should be key (not question number as keys) and the respective options should be list of values and the options of a question should be kept together and do not forget the format in which I asked.`
   
     const result = await model.generateContent(prompt);
     const response = await result.response;
     const text = response.text();
   
     const prompt1 = `Now replace all the \n characters with space also dont remove the A, B, C, D options and dont misss anything and dont separate the questions and the respective options ${text}`
   
   const result1 = await model.generateContent(prompt1);
    const response1 = await result1.response;
    const text1 = response1.text();
   
   console.log(text1);
   
    

  } catch (error) {
    console.error(error);
  }
}

main() 
