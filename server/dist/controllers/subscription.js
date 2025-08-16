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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscription = void 0;
const Subscription_1 = __importDefault(require("../models/Subscription"));
const subscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { endpoint, keys, categories } = req.body;
        if (!endpoint || !(keys === null || keys === void 0 ? void 0 : keys.p256dh) || !(keys === null || keys === void 0 ? void 0 : keys.auth)) {
            return res.status(400).json({ error: "Invalid subscription payload" });
        }
        const saved = yield Subscription_1.default.findOneAndUpdate({ endpoint }, {
            endpoint,
            keys,
            categories: categories && categories.length > 0 ? categories : ["BreakingNews"],
        }, { upsert: true, new: true });
        res.status(201).json({ success: true, subscription: saved });
    }
    catch (error) {
        console.error("Failed to save subscription:", error);
        res.status(500).json({ error: "Failed to save subscription" });
    }
});
exports.subscription = subscription;
