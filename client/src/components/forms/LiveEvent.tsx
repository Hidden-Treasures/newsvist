"use client";

import React, { useEffect, useState } from "react";
import socket from "@/app/lib/socket";
import { toast } from "react-toastify";
import {
  useAddLiveEntry,
  useCreateLiveEvent,
  useLiveEventEntries,
  useLiveEvents,
} from "@/hooks/useNews";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Select } from "../ui/select";
import TextEditor from "@/utils/TextEditor";
import { LuLoaderCircle } from "react-icons/lu";
import FileDisplay from "@/helper/FileDisplay";
import VideoDisplay from "@/helper/VideoDisplay";
import FileSelector from "@/utils/FileSelector";

interface Media {
  url: string;
  public_id?: string;
  [key: string]: any;
}

type LiveEvent = {
  _id: string;
  liveUpdateType: string;
  headline: string;
};

type LiveEntry = {
  _id: string;
  title: string;
  content: string;
  author?: string;
  createdAt: string;
  file?: Media;
  video?: Media | null;
};

const LiveEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [newEventType, setNewEventType] = useState("");
  const [newEventHeadline, setNewEventHeadline] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { data: events = [] } = useLiveEvents();
  const { data } = useLiveEventEntries(selectedEvent?.liveUpdateType || "");
  const entries = data?.entries ?? [];

  const { mutate: createEvent, isPending: pendingLiveEvent } =
    useCreateLiveEvent();
  const { mutate: addEntry, isPending: pendingLiveEntry } = useAddLiveEntry(
    selectedEvent?.liveUpdateType || ""
  );

  useEffect(() => {
    if (!selectedEvent) return;

    socket.emit("join-room", selectedEvent.liveUpdateType);
    socket.on("new-entry", () => {});

    return () => {
      socket.off("new-entry");
    };
  }, [selectedEvent]);

  const handleCreateEvent = () => {
    if (!newEventType || !newEventHeadline) {
      toast.error("Both type and headline required");
      return;
    }

    createEvent(
      { liveUpdateType: newEventType, headline: newEventHeadline },
      {
        onSuccess: () => {
          toast.success("Event created!");
          setNewEventType("");
          setNewEventHeadline("");
        },
        onError: () => toast.error("Error creating event"),
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);

    if (selected) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setFilePreview(null);
    }
  };

  const handleAddEntry = () => {
    if (!selectedEvent) {
      toast.error("Select an event first");
      return;
    }

    const formData = new FormData();
    formData.append("title", entryTitle);
    formData.append("content", entryContent);
    if (file) formData.append("file", file);

    addEntry(
      { formData },
      {
        onSuccess: () => {
          toast.success("Entry added!");
          setEntryTitle("");
          setEntryContent("");
          setFile(null);
          setFilePreview(null);
        },
        onError: () => toast.error("Error adding entry"),
      }
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Back Button */}
      <Button
        variant="secondary"
        className="mb-6 w-full md:w-auto"
        onClick={() => {
          setSelectedEvent(null);
          if (typeof (window as any).setNewsType === "function") {
            (window as any).setNewsType("");
          }
        }}
      >
        Back to News Form
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE: Forms */}
        <div className="flex-1 lg:w-1/3 flex flex-col gap-6">
          {/* CREATE NEW EVENT */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="text-lg font-semibold text-gray-300">
              Create New Live Event
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Input
                placeholder="Live Update Type (slug)"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
              />
              <Input
                placeholder="Headline"
                value={newEventHeadline}
                onChange={(e) => setNewEventHeadline(e.target.value)}
              />
              <Button
                variant="default"
                onClick={handleCreateEvent}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-900"
              >
                {pendingLiveEvent ? (
                  <LuLoaderCircle className="animate-spin w-5 h-5" />
                ) : (
                  "Create Event"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* SELECT EVENT */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="text-lg font-semibold text-gray-300">
              Select Live Event
            </CardHeader>
            <CardContent>
              <Select
                value={selectedEvent?._id || ""}
                onChange={(e) => {
                  const ev = events.find((ev) => ev._id === e.target.value);
                  if (ev) setSelectedEvent(ev);
                }}
              >
                <option value="">-- Select an event --</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.headline}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          {/* ADD ENTRY */}
          {selectedEvent && (
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="text-lg font-semibold text-gray-300">
                Add Live Update Entry
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input
                  placeholder="Entry Title"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="placeholder:text-gray-300 text-white"
                />
                <TextEditor
                  content={entryContent}
                  onChange={setEntryContent}
                  description={entryContent}
                />
                <FileSelector
                  name="entryMedia"
                  label="Select an image or video"
                  selectedFile={filePreview || undefined}
                  onChange={handleFileChange}
                />
                <Button
                  variant="secondary"
                  onClick={handleAddEntry}
                  className="flex items-center justify-center gap-2"
                >
                  {pendingLiveEntry ? (
                    <LuLoaderCircle className="animate-spin w-5 h-5" />
                  ) : (
                    "Add Entry"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT SIDE: Live Feed */}
        <div className="flex-1 lg:w-2/3 flex flex-col gap-4">
          <Card className="bg-slate-900 border-slate-700 overflow-y-auto hide-scrollbar max-h-[75vh] text-white">
            {selectedEvent ? (
              <div className="p-4 space-y-4">
                <h2 className="text-2xl font-bold sticky top-0 bg-slate-900 z-10 p-2 border-b border-slate-700">
                  {selectedEvent.headline}
                </h2>
                <div className="space-y-6">
                  {entries.length === 0 && (
                    <p className="text-gray-400 text-center py-10">
                      No updates yet for this event.
                    </p>
                  )}
                  {entries.map((entry) => (
                    <div
                      key={entry._id}
                      className="border-b border-slate-700 pb-3 last:border-none"
                    >
                      <h3 className="font-semibold text-lg">{entry.title}</h3>
                      <p
                        className="text-sm md:text-base text-gray-300 mt-2"
                        style={{ whiteSpace: "pre-line" }}
                        dangerouslySetInnerHTML={{
                          __html: `${entry.content.replace(
                            /^<p>|<\/p>$/g,
                            ""
                          )}`,
                        }}
                      />
                      {entry.file && <FileDisplay file={entry.file} />}
                      {entry.video && (
                        <VideoDisplay image={entry.file} video={entry.video} />
                      )}
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-20">
                Select an event to see updates
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveEvents;
