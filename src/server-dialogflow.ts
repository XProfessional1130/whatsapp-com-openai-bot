import express, { Request, Response } from 'express';
import * as dialogflow from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid'; // for generating unique session IDs

// Initialize Express App
const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("Server Is Working......");
});

// POST route for handling Dialogflow webhook requests
app.post('/webhook', async (req: Request, res: Response) => {
    const projectId = 'dialogflow-435217'; // Replace with your Dialogflow project ID
    const sessionId = uuid(); // Generate a unique session ID
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // The text query to send to Dialogflow
    const query = req.body.query || 'default query text';
    const languageCode = 'en'; // Set language code (e.g., 'en' for English)

    // Construct request payload for Dialogflow
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    try {
        // Send request to Dialogflow
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;

        res.json({
            query: result?.queryText,
            response: result?.fulfillmentText,
            intent: result?.intent?.displayName || 'No intent matched',
        });
    } catch (error) {
        console.error('Error during Dialogflow request:', error);
        res.status(500).send('Error processing the request');
    }
});

// Start the Express server on port 3000
app.listen(3000, () => {
    console.log("Server is Running on port 3000");
});
