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
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveScores = void 0;
const groupMatches = (matches) => {
    return matches.reduce((acc, match) => {
        const { competition, stage } = match;
        if (!acc[competition.name]) {
            acc[competition.name] = {};
        }
        if (!acc[competition.name][stage]) {
            acc[competition.name][stage] = [];
        }
        acc[competition.name][stage].push(match);
        return acc;
    }, {});
};
const fetchLiveScores = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.FOOTBALL_API_TOKEN) {
        throw new Error("Football API token is missing in environment variables.");
    }
    const response = yield fetch("https://api.football-data.org/v4/matches", {
        headers: { "X-Auth-Token": process.env.FOOTBALL_API_TOKEN },
    });
    if (!response.ok) {
        const errorText = yield response.text();
        throw new Error(`Failed to fetch matches: ${response.status} ${errorText}`);
    }
    return response.json();
});
const liveScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = yield fetchLiveScores();
        if (!((_a = data === null || data === void 0 ? void 0 : data.matches) === null || _a === void 0 ? void 0 : _a.length)) {
            return res.status(200).json({
                success: true,
                message: "No matches available at the moment.",
                groupedMatches: {},
            });
        }
        const groupedMatches = groupMatches(data.matches);
        return res.status(200).json({
            success: true,
            groupedMatches,
        });
    }
    catch (error) {
        console.error("LiveScores Error:", error.message);
        return res.status(500).json({
            success: false,
            error: error.message || "An unexpected error occurred.",
        });
    }
});
exports.liveScores = liveScores;
