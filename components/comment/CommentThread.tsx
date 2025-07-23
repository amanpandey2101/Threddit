"use client";

import { useState } from "react";
import type {
  GetCommentRepliesQueryResult,
  GetPostCommentsQueryResult,
} from "@/sanity.types";
import CommentList from "./CommentList";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CommentThread({
  postId,
  replies,
}: {
  postId: string;
  replies: GetCommentRepliesQueryResult | GetPostCommentsQueryResult;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 my-2"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>{isExpanded ? "Collapse thread" : `View ${replies.length} replies`}</span>
      </button>
      {isExpanded && (
        <div className="mt-3 ps-2 border-s-2 border-gray-100">
          <CommentList postId={postId} comments={replies} />
        </div>
      )}
    </div>
  );
} 