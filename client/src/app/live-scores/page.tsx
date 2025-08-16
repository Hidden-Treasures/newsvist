"use client";

import { useLiveScores } from "@/hooks/useNews";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuLoader, LuTrophy } from "react-icons/lu";
import { Clock } from "react-feather";
import Image from "next/image";

const Page = () => {
  const { data, isLoading, isError, error } = useLiveScores();
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const STATUS_STYLES: Record<string, string> = {
    LIVE: "bg-red-500 text-white",
    IN_PLAY: "bg-red-500 text-white",
    PAUSED: "bg-yellow-400 text-black",
    FINISHED: "bg-green-500 text-white",
    SCHEDULED: "bg-gray-400 text-white",
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      {Object.entries(data.groupedMatches).map(([competition, stages]) => (
        <div key={competition} className="space-y-8">
          {/* Competition Name */}
          <h2 className="text-lg font-bold text-gray-800 text-center mb-4">
            {competition}
          </h2>

          {Object.entries(stages).map(([stage, matches]) => (
            <div key={stage} className="space-y-4">
              {/* Stage */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide text-center">
                {stage}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {matches.map((match: any) => {
                  const statusColor =
                    STATUS_STYLES[match.status] || "bg-gray-400 text-white";
                  const isLive =
                    match.status === "LIVE" || match.status === "IN_PLAY";
                  const isPaused = match.status === "PAUSED";
                  const isFinished = match.status === "FINISHED";
                  const tickerText = isLive
                    ? match.minute
                      ? `${match.minute}'`
                      : "Live Now"
                    : isPaused
                    ? "HT"
                    : isFinished
                    ? "FT"
                    : new Date(match.utcDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                  return (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.03 }}
                      className="relative flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-2xl"
                      onClick={() => setSelectedMatch(match)}
                    >
                      {/* Status Badge */}
                      <span
                        className={`absolute top-2 right-2 px-3 py-0.5 text-xs font-semibold rounded-full ${statusColor}`}
                      >
                        {mounted ? tickerText : "-"}
                      </span>

                      {/* Teams */}
                      <div className="flex items-center justify-between w-full mb-3">
                        {/* Home Team */}
                        <div className="flex flex-col items-center">
                          {match.homeTeam.crest && (
                            <Image
                              src={match.homeTeam.crest}
                              alt={match.homeTeam.name}
                              width={36}
                              height={36}
                              className="rounded-full object-contain mb-1"
                            />
                          )}
                          <span className="text-sm font-semibold text-gray-700 text-center truncate w-16">
                            {match.homeTeam.name}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="text-lg font-bold text-gray-900">
                          {match.score.fullTime.home ?? "-"} :{" "}
                          {match.score.fullTime.away ?? "-"}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center">
                          {match.awayTeam.crest && (
                            <Image
                              src={match.awayTeam.crest}
                              alt={match.awayTeam.name}
                              width={36}
                              height={36}
                              className="rounded-full object-contain mb-1"
                            />
                          )}
                          <span className="text-sm font-semibold text-gray-700 text-center truncate w-16">
                            {match.awayTeam.name}
                          </span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="text-xs text-gray-500">
                        {isLive && match.minute
                          ? `${match.minute}'`
                          : isPaused
                          ? "Half Time"
                          : isFinished
                          ? "Full Time"
                          : new Date(match.utcDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Status Styles */}
              {(() => {
                const STATUS_STYLES: Record<string, string> = {
                  LIVE: "bg-red-500 text-white",
                  IN_PLAY: "bg-red-500 text-white",
                  PAUSED: "bg-yellow-400 text-black",
                  FINISHED: "bg-green-500 text-white",
                  SCHEDULED: "bg-gray-400 text-white",
                };
                const statusClass =
                  STATUS_STYLES[selectedMatch.status] ||
                  "bg-gray-400 text-white";

                return (
                  <>
                    {/* Header */}
                    <div
                      className={`text-center mb-4 rounded-lg p-2 ${statusClass}`}
                    >
                      <h2 className="font-bold text-xl">
                        {selectedMatch.homeTeam.name} vs{" "}
                        {selectedMatch.awayTeam.name}
                      </h2>
                      <p className="text-sm">
                        {selectedMatch.competition.name} - {selectedMatch.stage}
                      </p>
                      <p className="mt-1 text-xs">
                        Status: {selectedMatch.status}{" "}
                        {selectedMatch.minute
                          ? `(${selectedMatch.minute}')`
                          : ""}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex justify-around items-center my-4">
                      <div className="text-center">
                        <p className="font-semibold">
                          {selectedMatch.homeTeam.name}
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedMatch.score.fullTime.home ?? "-"}
                        </p>
                      </div>
                      <span className="text-xl font-bold">:</span>
                      <div className="text-center">
                        <p className="font-semibold">
                          {selectedMatch.awayTeam.name}
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedMatch.score.fullTime.away ?? "-"}
                        </p>
                      </div>
                    </div>

                    {/* Lineups */}
                    {selectedMatch.lineups && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2 text-center">
                          Lineups
                        </h3>
                        <div className="flex justify-between text-sm">
                          <div className="w-1/2">
                            <p className="font-medium text-gray-600">
                              Home Team
                            </p>
                            <ul className="list-disc list-inside">
                              {selectedMatch.lineups.home.map((p: any) => (
                                <li key={p.id}>{p.name}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="w-1/2">
                            <p className="font-medium text-gray-600">
                              Away Team
                            </p>
                            <ul className="list-disc list-inside">
                              {selectedMatch.lineups.away.map((p: any) => (
                                <li key={p.id}>{p.name}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Match Events */}
                    {selectedMatch.events &&
                      selectedMatch.events.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-700 mb-2 text-center">
                            Match Events
                          </h3>
                          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                            {selectedMatch.events.map(
                              (event: any, idx: number) => (
                                <li key={idx} className="flex justify-between">
                                  <span className="text-gray-600">
                                    {event.time}'
                                  </span>
                                  <span className="font-medium">
                                    {event.team}
                                  </span>
                                  <span>{event.description}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Close Button */}
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setSelectedMatch(null)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
