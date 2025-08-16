import { Request, Response } from "express";

interface Match {
  competition: { name: string };
  stage: string;
  [key: string]: any;
}

interface ApiResponse {
  matches: Match[];
}

const groupMatches = (matches: Match[]) => {
  return matches.reduce<Record<string, Record<string, Match[]>>>(
    (acc, match) => {
      const { competition, stage } = match;

      if (!acc[competition.name]) {
        acc[competition.name] = {};
      }

      if (!acc[competition.name][stage]) {
        acc[competition.name][stage] = [];
      }

      acc[competition.name][stage].push(match);

      return acc;
    },
    {}
  );
};

const fetchLiveScores = async (): Promise<ApiResponse> => {
  if (!process.env.FOOTBALL_API_TOKEN) {
    throw new Error("Football API token is missing in environment variables.");
  }

  const response = await fetch("https://api.football-data.org/v4/matches", {
    headers: { "X-Auth-Token": process.env.FOOTBALL_API_TOKEN },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch matches: ${response.status} ${errorText}`);
  }

  return response.json();
};

export const liveScores = async (req: Request, res: Response) => {
  try {
    const data = await fetchLiveScores();

    if (!data?.matches?.length) {
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
  } catch (error: any) {
    console.error("LiveScores Error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred.",
    });
  }
};
