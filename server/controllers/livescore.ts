import { Request, Response } from "express";

export const liveScores = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://api.football-data.org/v4/matches", {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_TOKEN!,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch matches" });
    }

    const data = await response.json();
    const allMatches = data.matches;

    const groupedMatches = allMatches.reduce((acc: any, match: any) => {
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
  } catch (error) {
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
