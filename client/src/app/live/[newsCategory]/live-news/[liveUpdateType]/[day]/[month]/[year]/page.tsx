import LiveUpdateClient from "@/components/LiveUpdateClient";

export interface LiveNewsProps {
  params: {
    newsCategory: string;
    liveUpdateType: string;
    day: string;
    month: string;
    year: string;
  };
}

const LiveNews = async (props: {
  params: Promise<LiveNewsProps["params"]>;
}) => {
  const resolvedParams = await props.params;
  return <LiveUpdateClient params={resolvedParams} />;
};

export default LiveNews;
