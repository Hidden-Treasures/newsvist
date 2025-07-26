"use client";

import React, { FC, useState } from "react";
import Comment from "./Comment";
import { CommentType } from "./Comment";
import { useGetComments, usePostComment, useReply } from "@/hooks/useNews";

interface CommentListProps {
  articleId: string;
}

const CommentList: FC<CommentListProps> = ({ articleId }) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [visibleComments, setVisibleComments] = useState<number>(3);

  const { data: comments = [], isLoading, refetch } = useGetComments(articleId);
  const postComment = usePostComment(articleId);
  const replyToComment = useReply(articleId);

  const handleNewCommentSubmit = () => {
    if (!newCommentText.trim()) return alert("Comment cannot be empty");
    postComment.mutate(newCommentText, {
      onSuccess: () => {
        setNewCommentText("");
        refetch();
      },
    });
  };

  const handleReplySubmit = (parentCommentId: string, replyText: string) => {
    if (!replyText.trim()) return alert("Reply cannot be empty");

    replyToComment.mutate(
      { replyText, parentCommentId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleShowMoreComments = () => {
    setVisibleComments((prev) => prev + 10);
  };

  const handleShowLessComments = () => {
    setVisibleComments(3);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <p className="uppercase font-bold text-xl text-black mb-2 border-b-4 border-blue-300 w-28">
        Comment
      </p>

      <div className="mb-4">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="border border-gray-300 rounded-lg px-3 py-5 w-full text-sm"
        />
        <button
          onClick={handleNewCommentSubmit}
          className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1 mt-2"
        >
          {postComment.isPending ? "Submitting..." : "Submit"}
        </button>
      </div>

      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          <>
            {comments
              ?.slice(0, visibleComments)
              ?.map((comment: CommentType) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onReply={handleReplySubmit}
                />
              ))}
            {comments?.length > visibleComments ? (
              <button
                onClick={handleShowMoreComments}
                className="text-blue-500 text-sm mt-4 hover:underline"
              >
                Show more comments
              </button>
            ) : (
              visibleComments > 3 && (
                <button
                  onClick={handleShowLessComments}
                  className="text-blue-500 text-sm mt-4 hover:underline"
                >
                  Show less comments
                </button>
              )
            )}
          </>
        </>
      )}
    </div>
  );
};

export default CommentList;
