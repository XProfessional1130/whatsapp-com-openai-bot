"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var openai_1 = require("openai");
var twilio_1 = require("twilio");
var dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
var app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// Twilio setup
var twilioClient = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
var twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
// OpenAI API Configuration
var openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
// Webhook for receiving messages from WhatsApp
app.post("/whatsapp", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var incomingMessage, from, aiResponse, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                incomingMessage = req.body.Body;
                from = req.body.From;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                if (!(incomingMessage.toLowerCase() === "contract")) return [3 /*break*/, 3];
                // Send initial greeting message
                return [4 /*yield*/, sendWhatsAppMessage(from, "Hello. How are you?")];
            case 2:
                // Send initial greeting message
                _a.sent();
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, getAIResponse(incomingMessage)];
            case 4:
                aiResponse = _a.sent();
                return [4 /*yield*/, sendWhatsAppMessage(from, aiResponse)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                res.sendStatus(200);
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.error("Error handling the message:", error_1);
                res.sendStatus(500);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// Function to send WhatsApp message via Twilio
var sendWhatsAppMessage = function (to, message) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, twilioClient.messages.create({
                        from: twilioWhatsAppNumber,
                        to: to,
                        body: message,
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error sending WhatsApp message:", error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Function to get AI response from OpenAI
var getAIResponse = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [{ role: "user", content: message }],
                    })];
            case 1:
                response = _b.sent();
                return [2 /*return*/, ((_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim()) || ""];
            case 2:
                error_3 = _b.sent();
                console.error("Error generating AI response:", error_3);
                return [2 /*return*/, "Sorry, I couldn't process your message."];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
