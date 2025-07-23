"use client";

import { useState } from "react";
import PostVoteButtons from "./PostVoteButtons";
import { MessageSquare } from "lucide-react";
import CommentListClient from "../comment/CommentListClient";
import CommentInput from "../comment/CommentInput";
import type {
  GetPostVotesQueryResult,
  GetUserPostVoteStatusQueryResult,
  GetPostCommentsQueryResult,
} from "@/sanity.types";

export default function PostFooter({
  postId,
  votes,
  vote,
  commentCount = 0,
  comments,
}: {
  postId: string;
  votes: GetPostVotesQueryResult;
  vote: GetUserPostVoteStatusQueryResult;
  commentCount: number;
  comments: GetPostCommentsQueryResult;
}) {
  const [commentsVisible, setCommentsVisible] = useState(false);

  const handleToggleComments = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCommentsVisible(!commentsVisible);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <PostVoteButtons
          contentId={postId}
          votes={votes}
          vote={vote}
          contentType="post"
        />
        <button
          onClick={handleToggleComments}
          className="flex items-center gap-2 text-sm text-gray-500 hover:bg-gray-100 p-2 rounded-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{commentCount} Comments</span>
        </button>
      </div>
      
      {commentsVisible && (
        <div className="mt-2">
          <CommentInput postId={postId} />
          
          {commentCount > 0 && comments.length > 0 && (
            <div className="mt-4">
              <CommentListClient postId={postId} comments={comments} showHeader={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 