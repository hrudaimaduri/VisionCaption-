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
exports.GeminiVisionCaptionProvider = void 0;
var genai_1 = require("@google/genai");
var mock_provider_1 = require("./mock-provider");
var GeminiVisionCaptionProvider = /** @class */ (function () {
    function GeminiVisionCaptionProvider() {
        // Initialize server-side Gemini client. Assumes GEMINI_API_KEY is in env.
        var apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is missing.");
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey: apiKey });
        // Fall back to MockProvider for Phase 1/3 features not yet implemented in Gemini
        this.mockProvider = new mock_provider_1.MockVisionCaptionProvider();
    }
    GeminiVisionCaptionProvider.prototype.analyzeImage = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var model, promptText, contents, config, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
                        promptText = "Analyze this image and extract factual visual evidence. \nReturn ONLY a valid JSON object matching this schema:\n{\n  \"objects\": [{\"name\": \"string\", \"attributes\": [\"string\"]}],\n  \"actions\": [{\"subject\": \"string\", \"action\": \"string\"}],\n  \"relationships\": [{\"subject\": \"string\", \"relation\": \"string\", \"object\": \"string\"}],\n  \"uncertain\": [\"string\"]\n}\nCRITICAL: \n- Only report visually supported information.\n- Do not invent exact identities, unsupported locations, emotions (unless visually clear), intentions, hidden objects, or facts outside the image.\n- If something is uncertain, put it in the \"uncertain\" array rather than asserting it as a fact.\n";
                        contents = [promptText];
                        if (input.inlineData) {
                            contents.push({
                                inlineData: {
                                    data: input.inlineData.data,
                                    mimeType: input.inlineData.mimeType,
                                }
                            });
                        }
                        config = {
                            responseMimeType: "application/json",
                        };
                        return [4 /*yield*/, this.generateWithRetry(model, contents, config)];
                    case 1:
                        text = _a.sent();
                        try {
                            return [2 /*return*/, JSON.parse(text)];
                        }
                        catch (e) {
                            console.error("Failed to parse analyzeImage response", text);
                            throw new Error("Invalid JSON returned from analyzeImage.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GeminiVisionCaptionProvider.prototype.generateWithRetry = function (model, contents, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response, attempt, maxAttempts, _loop_1, this_1, state_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        attempt = 0;
                        maxAttempts = 3;
                        _loop_1 = function () {
                            var error_1, errorMessage, status_1, isTransient, backoffMs_1;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 2, , 4]);
                                        return [4 /*yield*/, this_1.ai.models.generateContent({
                                                model: model,
                                                contents: contents,
                                                config: config
                                            })];
                                    case 1:
                                        response = _d.sent();
                                        return [2 /*return*/, "break"];
                                    case 2:
                                        error_1 = _d.sent();
                                        attempt++;
                                        errorMessage = ((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
                                        status_1 = (error_1 === null || error_1 === void 0 ? void 0 : error_1.status) || ((_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _b === void 0 ? void 0 : _b.status);
                                        isTransient = status_1 === 503 ||
                                            status_1 === 429 ||
                                            errorMessage.includes("503") ||
                                            errorMessage.includes("429") ||
                                            errorMessage.includes("high demand") ||
                                            errorMessage.includes("temporarily overloaded") ||
                                            errorMessage.includes("quota");
                                        if (!isTransient || attempt >= maxAttempts) {
                                            throw error_1;
                                        }
                                        backoffMs_1 = Math.pow(2, attempt - 1) * 1000;
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, backoffMs_1); })];
                                    case 3:
                                        _d.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _c.label = 1;
                    case 1:
                        if (!(attempt < maxAttempts)) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        state_1 = _c.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 3];
                        return [3 /*break*/, 1];
                    case 3:
                        if (!response || !response.text) {
                            throw new Error("Gemini returned an empty response.");
                        }
                        return [2 /*return*/, response.text];
                }
            });
        });
    };
    GeminiVisionCaptionProvider.prototype.generateCaption = function (input, evidence) {
        return __awaiter(this, void 0, void 0, function () {
            var model, promptText, contents, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
                        promptText = "You are a highly accurate image captioning system.\nYour task is to generate a natural image caption based on the following constraints:\n\nPURPOSE: ".concat(input.purpose, "\nLANGUAGE: ").concat(input.language, "\nDETAIL LEVEL: ").concat(input.detailLevel, "\n\nCRITICAL INSTRUCTIONS:\n- Describe ONLY what is visually supported by the image.\n- AVOID inventing people, objects, actions, relationships, locations, emotions, intentions, or events.\n- Follow the requested purpose style exactly.\n- Follow the requested language. Do not fake multilingual output; respond accurately in ").concat(input.language, ".\n- Adhere to the requested detail level (").concat(input.detailLevel, ").\n- Produce a natural, well-formed caption.\n- DO NOT mention these instructions or your internal prompt.\n- Return ONLY the caption text. Do not add quotes, markdown formatting, or any extra text.");
                        contents = [promptText];
                        if (input.inlineData) {
                            contents.push({
                                inlineData: {
                                    data: input.inlineData.data,
                                    mimeType: input.inlineData.mimeType,
                                }
                            });
                        }
                        return [4 /*yield*/, this.generateWithRetry(model, contents)];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, text.trim()];
                }
            });
        });
    };
    GeminiVisionCaptionProvider.prototype.verifyCaption = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var model, promptText, config, text, claims, factualClaims, supported, unsupported, uncertain, overallScore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
                        if (!input.caption) {
                            return [2 /*return*/, {
                                    overallScore: 0,
                                    unsupportedClaims: 1,
                                    uncertainClaims: 0,
                                    claims: [{
                                            type: "OTHER",
                                            text: "No caption provided",
                                            status: "unsupported",
                                            confidence: 1.0,
                                            reasoning: "The generation step failed to produce a caption."
                                        }]
                                }];
                        }
                        promptText = "You are a strict verification system.\nCompare the CANDIDATE CAPTION against the provided VISUAL EVIDENCE.\nBreak the caption into distinct factual claims (objects, attributes, actions, relationships, scene).\nFor each claim, check if it is supported by the VISUAL EVIDENCE JSON.\n- If it is clearly supported, status is \"supported\".\n- If there is partial or weak evidence but not conclusive, status is \"uncertain\".\n- If it contradicts or is completely missing from the evidence, status is \"unsupported\".\n\nCANDIDATE CAPTION:\n".concat(input.caption, "\n\nVISUAL EVIDENCE:\n").concat(JSON.stringify(input.evidence, null, 2), "\n\nReturn ONLY a valid JSON array of claims matching this schema:\n[\n  {\n    \"type\": \"OBJECT\" | \"ATTRIBUTE\" | \"ACTION\" | \"RELATIONSHIP\" | \"SCENE\" | \"OTHER\",\n    \"text\": \"The extracted claim text\",\n    \"status\": \"supported\" | \"uncertain\" | \"unsupported\",\n    \"confidence\": 0.0 to 1.0,\n    \"evidence\": \"Brief string referencing the evidence (or lack thereof)\",\n    \"reasoning\": \"Explain why this status was chosen\"\n  }\n]\n");
                        config = {
                            responseMimeType: "application/json",
                        };
                        return [4 /*yield*/, this.generateWithRetry(model, [promptText], config)];
                    case 1:
                        text = _a.sent();
                        claims = [];
                        try {
                            claims = JSON.parse(text);
                        }
                        catch (e) {
                            console.error("Failed to parse verifyCaption response", text);
                            throw new Error("Invalid JSON returned from verifyCaption.");
                        }
                        factualClaims = claims.length || 1;
                        supported = claims.filter(function (c) { return c.status === "supported"; }).length;
                        unsupported = claims.filter(function (c) { return c.status === "unsupported"; }).length;
                        uncertain = claims.filter(function (c) { return c.status === "uncertain"; }).length;
                        overallScore = Math.round((supported / factualClaims) * 100);
                        return [2 /*return*/, {
                                overallScore: overallScore,
                                unsupportedClaims: unsupported,
                                uncertainClaims: uncertain,
                                claims: claims
                            }];
                }
            });
        });
    };
    GeminiVisionCaptionProvider.prototype.refineCaption = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var model, promptText, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
                        if (input.verification.unsupportedClaims === 0 && input.verification.uncertainClaims === 0) {
                            return [2 /*return*/, input.caption];
                        }
                        promptText = "You are an image caption refinement system.\nYour task is to rewrite the candidate caption based on the verification results.\n\nCANDIDATE CAPTION:\n".concat(input.caption, "\n\nLANGUAGE REQUIRED: ").concat(input.language, "\n\nVERIFICATION RESULTS:\n").concat(JSON.stringify(input.verification.claims, null, 2), "\n\nVISUAL EVIDENCE:\n").concat(JSON.stringify(input.evidence, null, 2), "\n\nINSTRUCTIONS:\n1. Preserve supported visual information.\n2. Remove unsupported claims.\n3. Weaken uncertain claims when appropriate (e.g. use words like \"appears to be\" or remove if highly uncertain).\n4. Do not add new visual facts.\n5. Do not introduce facts that were absent from the candidate caption unless they are required to make the sentence grammatical.\n6. Preserve the original tone and language (").concat(input.language, ").\n7. Preserve the original purpose and detail level style as much as possible.\n8. Keep the final caption natural and readable.\n\nReturn ONLY the refined caption text. Do not output JSON. Do not add formatting.");
                        return [4 /*yield*/, this.generateWithRetry(model, [promptText])];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, text.trim()];
                }
            });
        });
    };
    return GeminiVisionCaptionProvider;
}());
exports.GeminiVisionCaptionProvider = GeminiVisionCaptionProvider;
