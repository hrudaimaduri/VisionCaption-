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
exports.MockVisionCaptionProvider = void 0;
// A realistic development provider that produces deterministic results
// depending on the requested purpose and detail level.
var MockVisionCaptionProvider = /** @class */ (function () {
    function MockVisionCaptionProvider() {
    }
    MockVisionCaptionProvider.prototype.analyzeImage = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Simulate network delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                    case 1:
                        // Simulate network delay
                        _a.sent();
                        return [2 /*return*/, {
                                objects: [
                                    { name: "person", attributes: ["walking"], confidence: 0.98 },
                                    { name: "umbrella", attributes: ["red"], confidence: 0.95 },
                                    { name: "road", attributes: ["wet"], confidence: 0.92 },
                                    { name: "car", attributes: ["speeding"], confidence: 0.75 },
                                ],
                                actions: [
                                    { subject: "person", action: "walking", confidence: 0.91 },
                                    { subject: "person", action: "holding umbrella", confidence: 0.96 },
                                ],
                                relationships: [
                                    { subject: "person", relation: "near", object: "road", confidence: 0.95 },
                                    { subject: "car", relation: "on", object: "road", confidence: 0.85 },
                                ],
                                uncertain: ["speed of car", "danger level"]
                            }];
                }
            });
        });
    };
    MockVisionCaptionProvider.prototype.generateCaption = function (input, evidence) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1200); })];
                    case 1:
                        _a.sent();
                        // Return a purposeful caption with an intentional unsupported claim for demonstration,
                        // especially when detail level is "Detailed" and purpose is "Safety".
                        if (input.purpose === "Safety") {
                            if (input.detailLevel === "Detailed") {
                                return [2 /*return*/, "A person is walking dangerously close to a wet road holding a red umbrella, while a speeding car approaches from behind."];
                            }
                            return [2 /*return*/, "A person with a red umbrella is walking near a wet road with a car present."];
                        }
                        if (input.purpose === "Accessibility") {
                            return [2 /*return*/, "A person holding a red umbrella walking near a wet road with a car."];
                        }
                        if (input.purpose === "Social Media") {
                            return [2 /*return*/, "Rainy days call for a bright red umbrella! 🌧️☔ Stay safe by the road."];
                        }
                        if (input.purpose === "Education") {
                            return [2 /*return*/, "The image demonstrates a pedestrian environment during precipitation. Visible elements include a person, a red umbrella, and a wet road surface."];
                        }
                        if (input.language === "Telugu") {
                            return [2 /*return*/, "ఒక వ్యక్తి ఎర్రటి గొడుగు పట్టుకుని తడి రోడ్డు దగ్గర నడుస్తున్నాడు."];
                        }
                        // General / Default
                        return [2 /*return*/, "A person is standing near a road holding an umbrella, and a child is playing nearby."];
                }
            });
        });
    };
    MockVisionCaptionProvider.prototype.verifyCaption = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerCaption, claims, unsupportedCount, totalClaims, supportedClaims, overallScore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                    case 1:
                        _a.sent();
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
                        lowerCaption = input.caption.toLowerCase();
                        claims = [];
                        unsupportedCount = 0;
                        // Check known concepts
                        if (lowerCaption.includes("person") || lowerCaption.includes("వ్యక్తి")) {
                            claims.push({ type: "OBJECT", text: "person", status: "supported", confidence: 0.98 });
                        }
                        if (lowerCaption.includes("umbrella") || lowerCaption.includes("గొడుగు")) {
                            claims.push({ type: "OBJECT", text: "umbrella", status: "supported", confidence: 0.95 });
                        }
                        if (lowerCaption.includes("red") || lowerCaption.includes("ఎర్రటి")) {
                            claims.push({ type: "ATTRIBUTE", text: "red umbrella", status: "supported", confidence: 0.88 });
                        }
                        if (lowerCaption.includes("road") || lowerCaption.includes("రోడ్డు")) {
                            claims.push({ type: "OBJECT", text: "road", status: "supported", confidence: 0.92 });
                        }
                        // Intentional unsupported claims for demo
                        if (lowerCaption.includes("speeding")) {
                            claims.push({
                                type: "ATTRIBUTE",
                                text: "speeding car",
                                status: "unsupported",
                                confidence: 0.2,
                                reasoning: "No sufficiently reliable visual evidence detected for the speed of the car."
                            });
                            unsupportedCount++;
                        }
                        if (lowerCaption.includes("dangerously")) {
                            claims.push({
                                type: "ACTION",
                                text: "walking dangerously",
                                status: "unsupported",
                                confidence: 0.1,
                                reasoning: "Hazard level is an inference not directly supported by visual evidence."
                            });
                            unsupportedCount++;
                        }
                        if (lowerCaption.includes("child")) {
                            claims.push({
                                type: "OBJECT",
                                text: "child playing",
                                status: "unsupported",
                                confidence: 0.05,
                                reasoning: "No sufficiently reliable visual evidence detected for a child."
                            });
                            unsupportedCount++;
                        }
                        totalClaims = claims.length || 1;
                        supportedClaims = claims.filter(function (c) { return c.status === "supported"; }).length;
                        overallScore = Math.round((supportedClaims / totalClaims) * 100);
                        return [2 /*return*/, {
                                overallScore: overallScore,
                                unsupportedClaims: unsupportedCount,
                                uncertainClaims: 0,
                                claims: claims
                            }];
                }
            });
        });
    };
    MockVisionCaptionProvider.prototype.refineCaption = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        _a.sent();
                        if (input.verification.unsupportedClaims === 0) {
                            return [2 /*return*/, input.caption];
                        }
                        // Simulate refinement based on the demo outputs
                        if (input.caption.includes("dangerously") || input.caption.includes("speeding")) {
                            return [2 /*return*/, "A person is walking near a wet road holding a red umbrella, with a car visible."];
                        }
                        if (input.caption.includes("child is playing")) {
                            return [2 /*return*/, "A person is standing near a road holding an umbrella."];
                        }
                        return [2 /*return*/, input.caption + " (Refined)"];
                }
            });
        });
    };
    return MockVisionCaptionProvider;
}());
exports.MockVisionCaptionProvider = MockVisionCaptionProvider;
