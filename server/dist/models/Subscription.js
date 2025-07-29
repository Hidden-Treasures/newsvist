"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubscriptionSchema = new mongoose_1.default.Schema({
    endpoint: String,
    keys: {
        p256dh: String,
        auth: String,
    },
});
const Subscription = mongoose_1.default.model("Subscription", SubscriptionSchema);
exports.default = Subscription;
