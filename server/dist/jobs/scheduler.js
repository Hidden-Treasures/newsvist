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
exports.startSchedulers = startSchedulers;
const node_cron_1 = __importDefault(require("node-cron"));
const News_1 = __importDefault(require("../models/News"));
function startSchedulers() {
    // Run every minute
    node_cron_1.default.schedule("* * * * *", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date();
            const scheduledArticles = yield News_1.default.find({
                status: "scheduled",
                publishedAt: { $lte: now },
            });
            for (const article of scheduledArticles) {
                article.status = "approved";
                article.published = true;
                yield article.save();
                console.log(`✅ Published scheduled article: ${article.title}`);
            }
        }
        catch (err) {
            console.error("❌ Scheduler error:", err);
        }
    }));
    console.log("📅 Scheduler started");
}
