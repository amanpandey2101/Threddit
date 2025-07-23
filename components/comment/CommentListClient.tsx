"use client";

import {
  GetCommentRepliesQueryResult,
  GetPostCommentsQueryResult,
} from "@/sanity.types";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import TimeAgo from "../TimeAgo";
import CommentReply from "./CommentReply";
import PostVoteButtons from "../post/PostVoteButtons";
import CommentWithReplies from "./CommentWithReplies";

interface CommentClientProps {
  comment: GetPostCommentsQueryResult[number] | GetCommentRepliesQueryResult[number];
  postId: string;
}

function CommentClient({ comment, postId }: CommentClientProps) {
  const userVoteStatus = comment.votes?.voteStatus || null;

  return (
    <article className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex gap-4">
        <PostVoteButtons
          contentId={comment._id}
          votes={comment.votes || { upvotes: 0, downvotes: 0, netScore: 0 }}
          vote={userVoteStatus}
          contentType="comment"
        />

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {comment.author?.imageUrl ? (
              <div className="flex-shrink-0">
                <Image
                  src={comment.author.imageUrl}
                  alt={`${comment.author.username}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <div className="flex-shrink-0">
                <UserCircle className="w-10 h-10 text-gray-300" />
              </div>
            )}

            <h3 className="font-medium text-gray-900">
              {comment.author?.username || "Anonymous"}
            </h3>
            <span className="text-xs text-gray-500">
              <TimeAgo date={new Date(comment.createdAt!)} />
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">{comment.content}</p>

          <CommentReply postId={postId} comment={comment} />

          {/* Comment replies - supports infinite nesting */}
          {comment.replies && comment.replies.length > 0 && (
            <CommentWithReplies 
              postId={postId} 
              initialReplies={comment.replies as unknown as GetCommentRepliesQueryResult} 
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default function CommentListClient({
  postId,
  comments,
  showHeader = false,
}: {
  postId: string;
  comments: GetPostCommentsQueryResult | GetCommentRepliesQueryResult;
  showHeader?: boolean;
}) {
  const isRootComment = !comments.some((comment) => comment.parentComment);

  return (
    <section className={showHeader ? "mt-8" : ""}>
      {showHeader && (
        <div className="flex items-center justify-between">
          {isRootComment && (
            <h2 className="text-lg font-semibold text-gray-900">
              Comments ({comments.length})
            </h2>
          )}
        </div>
      )}

      <div className="divide-y divide-gray-100 rounded-lg bg-white">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentClient
              key={comment._id}
              postId={postId}
              comment={comment}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              {showHeader ? "No comments yet. Be the first to comment!" : "No replies yet."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 