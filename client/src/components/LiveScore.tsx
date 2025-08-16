import { useLiveScores } from "@/hooks/useNews";
import React from "react"; // icons
import { motion } from "framer-motion";
import { LuCircleAlert, LuLoader, LuTrophy } from "react-icons/lu";
import { Clock } from "react-feather";
import Link from "next/link";

const LiveScore = () => {
  const { data, isLoading, isError, error } = useLiveScores();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LuLoader className="animate-spin text-blue-600 w-10 h-10" />
        <span className="ml-3 text-lg font-medium text-gray-700">
          Fetching live scores...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <LuCircleAlert className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <p className="text-sm text-red-700">
          {(error as Error).message || "Unable to load live scores"}
        </p>
      </div>
    );
  }

  if (!data?.groupedMatches || Object.keys(data.groupedMatches).length === 0) {
    return (
      <div className="p-4 bg-gray-50 border rounded-lg text-center">
        <LuTrophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
        <p className="text-sm text-gray-700">No live matches right now ⚽</p>
      </div>
    );
  }

  const firstCompetition = Object.entries(data.groupedMatches)[0];
  const [competition, stages] = firstCompetition;

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      <h2 className="font-bold text-lg text-gray-900 mb-2 text-center">
        Live Scores Preview
      </h2>

      {Object.entries(stages).map(([stage, matches]) => (
        <div key={stage}>
          <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide text-center">
            {stage}
          </h3>

          <div className="flex space-x-3 overflow-x-auto hide-scrollbar px-2 snap-x snap-mandatory">
            {matches.slice(0, 5).map((match: any) => {
              const homeInitials = match.homeTeam.name
                .split(" ")
                .map((w: string) => w[0])
                .join("");
              const awayInitials = match.awayTeam.name
                .split(" ")
                .map((w: string) => w[0])
                .join("");

              const isLive =
                match.status === "LIVE" || match.status === "IN_PLAY";

              return (
                <motion.div
                  key={match.id}
                  whileHover={{ scale: 1.05 }}
                  className={`flex-shrink-0 snap-start flex flex-col items-center justify-center p-2 min-w-[120px] sm:min-w-[140px] bg-gradient-to-br ${
                    isLive
                      ? "from-red-400 to-red-200"
                      : "from-gray-100 to-white"
                  } rounded-xl shadow-lg cursor-pointer relative`}
                >
                  {/* LIVE badge */}
                  {isLive && (
                    <span className="absolute top-1 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}

                  <div className="flex items-center justify-between w-full mb-1 px-1">
                    {/* Home */}
                    <div className="flex items-center gap-1">
                      {match.homeTeam.crest && (
                        <img
                          src={match.homeTeam.crest}
                          alt={match.homeTeam.name}
                          className="w-5 h-5 object-contain rounded-full"
                        />
                      )}
                      <span className="text-[10px] font-semibold p-2">
                        {homeInitials}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="text-sm font-bold">
                      {match.score.fullTime.home ?? "-"} :{" "}
                      {match.score.fullTime.away ?? "-"}
                    </div>

                    {/* Away */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold pl-2">
                        {awayInitials}
                      </span>
                      {match.awayTeam.crest && (
                        <img
                          src={match.awayTeam.crest}
                          alt={match.awayTeam.name}
                          className="w-5 h-5 object-contain rounded-full"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Link to Full Scores */}
      <div className="text-center mt-2">
        <Link
          href="/live-scores"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          See all live scores →
        </Link>
      </div>
    </div>
  );
};

export default LiveScore;
