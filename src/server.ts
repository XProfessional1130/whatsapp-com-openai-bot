import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import OpenAIApi from "openai";
import twilio from "twilio";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string
);
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

// OpenAI API Configuration

const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY as string });

// Webhook for receiving messages from WhatsApp
app.post("/whatsapp", async (req: Request, res: Response) => {
  const incomingMessage: string = req.body.Body;
  const from: string = req.body.From;

  try {
    if (incomingMessage.toLowerCase() === "contract") {
      // Send initial greeting message
      await sendWhatsAppMessage(from, "Hello. How are you?");
    } else {
      // Use OpenAI to generate a response based on the customer's message
      const aiResponse = await getAIResponse(incomingMessage);
      await sendWhatsAppMessage(from, aiResponse);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling the message:", error);
    res.sendStatus(500);
  }
});

// Function to send WhatsApp message via Twilio
const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    await twilioClient.messages.create({
      from: twilioWhatsAppNumber,
      to: to,
      body: message,
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};

// Function to get AI response from OpenAI
const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
    });
    return response.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I couldn't process your message.";
  }
};

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
