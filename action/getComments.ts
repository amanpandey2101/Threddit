"use server";

import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getCommentReplies } from "@/sanity/lib/comment/getCommentReplies";

export async function getComments(postId: string, userId: string | null) {
  try {
    const comments = await getPostComments(postId, userId);
    return { comments, error: null };
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return { comments: [], error: "Failed to fetch comments" };
  }
}

export async function getReplies(commentId: string, userId: string | null) {
  try {
    const replies = await getCommentReplies(commentId, userId);
    return { replies, error: null };
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    return { replies: [], error: "Failed to fetch replies" };
  }
} 