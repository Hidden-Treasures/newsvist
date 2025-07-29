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
const liveScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("https://api.football-data.org/v4/matches", {
            headers: {
                "X-Auth-Token": process.env.FOOTBALL_API_TOKEN,
            },
        });
        if (!response.ok) {
            return res
                .status(response.status)
                .json({ error: "Failed to fetch matches" });
        }
        const data = yield response.json();
        const allMatches = data.matches;
        const groupedMatches = allMatches.reduce((acc, match) => {
            const competitionName = match.competition.name;
            const stageName = match.stage;
            if (!acc[competitionName]) {
                acc[competitionName] = {};
            }
            if (!acc[competitionName][stageName]) {
                acc[competitionName][stageName] = [];
            }
            acc[competitionName][stageName].push(match);
            return acc;
        }, {});
        return res.json({ groupedMatches });
    }
    catch (error) {
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
});
exports.liveScores = liveScores;
