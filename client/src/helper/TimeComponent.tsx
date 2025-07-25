import React, { useState, useEffect, FC } from "react";
import moment from "moment";

interface TimeComponentProps {
  timestamp: string | number | Date;
}

const TimeComponent: FC<TimeComponentProps> = ({ timestamp }) => {
  const calculateTimeDiff = (timestamp: string | number | Date): string => {
    const now = moment();
    const time = moment(timestamp);
    const diff = moment.duration(now.diff(time));

    if (diff.asSeconds() < 60) {
      return `${Math.round(diff.asSeconds())} seconds ago`;
    } else if (diff.asMinutes() < 60) {
      return `${Math.round(diff.asMinutes())} minutes ago`;
    } else if (diff.asHours() < 24) {
      return `${Math.round(diff.asHours())} hours ago`;
    } else {
      return `${Math.round(diff.asDays())} days ago`;
    }
  };

  const [formattedTime, setFormattedTime] = useState<string>(
    calculateTimeDiff(timestamp)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedTime(calculateTimeDiff(timestamp));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return (
    <div className="text-red-600 font-bold text-sm mb-2">{formattedTime}</div>
  );
};

export default TimeComponent;
