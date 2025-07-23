"use client";

import { useState } from "react";
import type {
  GetCommentRepliesQueryResult,
  GetPostCommentsQueryResult,
} from "@/sanity.types";
import CommentListClient from "./CommentListClient";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CommentWithReplies({
  postId,
  initialReplies,
}: {
  postId: string;
  initialReplies: GetCommentRepliesQueryResult | GetPostCommentsQueryResult;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replies] = useState(initialReplies);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span className="font-medium">
          {isExpanded ? "Hide replies" : `Show ${replies.length} replies`}
        </span>
      </button>
      {isExpanded && (
        <div className="mt-3 ml-4 border-l-2 border-gray-200 pl-4">
          <CommentListClient postId={postId} comments={replies} />
        </div>
      )}
    </div>
  );
} 