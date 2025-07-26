"use client";

import Image from "next/image";
import React, { FC, useState } from "react";

export interface CommentType {
  _id: string;
  commentText: string;
  isAnonymous?: boolean;
  user?: {
    username?: string;
    profilePhoto?: string;
  };
  name?: string;
  replies: CommentType[];
}

interface CommentProps {
  comment: CommentType;
  onReply: (commentId: string, replyText: string) => void;
}

const Comment: FC<CommentProps> = ({ comment, onReply }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [visibleReplies, setVisibleReplies] = useState(3);

  const handleReplyClick = () => {
    setShowReplyBox(!showReplyBox);
  };

  const handleReplySubmit = () => {
    onReply(comment._id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  const handleShowMoreReplies = () => {
    setVisibleReplies((prev) => prev + 10);
  };

  const handleShowLessReplies = () => {
    setVisibleReplies(3);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4">
      <div className="flex items-start gap-3">
        {comment.isAnonymous ? (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-semibold">
            A
          </div>
        ) : (
          <Image
            src={comment.user?.profilePhoto || "/default-profile.png"}
            alt="User Profile Photo"
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
          />
        )}
        <div className="flex flex-col text-sm">
          <strong className="text-gray-800">
            {comment.isAnonymous
              ? "Anonymous"
              : comment.user?.username || comment.name}
          </strong>
          <p className="text-gray-700">{comment.commentText}</p>
        </div>
      </div>

      <button
        onClick={handleReplyClick}
        className="text-blue-500 text-sm mt-2 hover:underline"
      >
        Reply
      </button>
      {showReplyBox && (
        <div className="mt-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
          />
          <button
            onClick={handleReplySubmit}
            className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1 mt-2"
          >
            Submit
          </button>
        </div>
      )}
      <div className="ml-6 mt-4">
        {comment.replies.slice(0, visibleReplies).map((reply) => (
          <Comment key={reply._id} comment={reply} onReply={onReply} />
        ))}
        {comment.replies.length > visibleReplies ? (
          <button
            onClick={handleShowMoreReplies}
            className="text-blue-500 text-sm mt-2 hover:underline"
          >
            Show more replies
          </button>
        ) : (
          visibleReplies > 3 && (
            <button
              onClick={handleShowLessReplies}
              className="text-blue-500 text-sm mt-2 hover:underline"
            >
              Show less replies
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Comment;
