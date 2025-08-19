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
    <div className="p-4 md:p-6">
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

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        {/* LEFT SIDE: Forms */}
        <div className="md:w-1/3 flex flex-col space-y-6">
          {/* Create Event */}
          <Card>
            <CardHeader>Create New Live Event</CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Input
                placeholder="Live Update Type (slug)"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
              />
              <Input
                placeholder="Headline"
                value={newEventHeadline}
                className="flex items-center justify-center space-x-2"
                onChange={(e) => setNewEventHeadline(e.target.value)}
              />
              <Button variant="primary" onClick={handleCreateEvent}>
                {pendingLiveEvent ? (
                  <LuLoaderCircle className="animate-spin text-white w-5 h-5" />
                ) : (
                  "Create Event"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Select Event */}
          <Card>
            <CardHeader>Select Live Event</CardHeader>
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

          {/* Add Entry */}
          {selectedEvent && (
            <Card>
              <CardHeader>Add Live Update Entry</CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <Input
                  placeholder="Entry Title"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                />
                <TextEditor
                  content={entryContent}
                  onChange={(newContent) => setEntryContent(newContent)}
                  description={entryContent}
                />

                <FileSelector
                  name="entryMedia"
                  label="Select an image or video"
                  selectedFile={filePreview || undefined}
                  onChange={handleFileChange}
                />

                <Button
                  variant="success"
                  onClick={handleAddEntry}
                  className="flex items-center justify-center space-x-2"
                >
                  {pendingLiveEntry ? (
                    <LuLoaderCircle className="animate-spin text-white w-5 h-5" />
                  ) : (
                    "Add Entry"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT SIDE: Live Feed */}
        <div className="md:w-2/3 flex flex-col space-y-4">
          <Card className="overflow-y-auto max-h-[70vh]">
            {selectedEvent ? (
              <>
                <h2 className="text-xl font-bold mb-4">
                  {selectedEvent.headline}
                </h2>
                <div className="space-y-4">
                  {entries?.map((entry) => (
                    <div
                      key={entry._id}
                      className="border-b pb-2 last:border-none"
                    >
                      <h3 className="font-semibold">{entry.title}</h3>
                      <p className="text-base leading-relaxed mt-4 mb-6">
                        <span
                          style={{ whiteSpace: "pre-line" }}
                          className="[&>*]:m-0 [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer hover:[&_a]:text-blue-800"
                          dangerouslySetInnerHTML={{
                            __html: `${entry.content.replace(
                              /^<p>|<\/p>$/g,
                              ""
                            )}`,
                          }}
                        />
                      </p>
                      {entry.file && <FileDisplay file={entry?.file} />}
                      {entry.video && (
                        <VideoDisplay image={entry?.file} video={entry.video} />
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center py-10">
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
