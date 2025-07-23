import { defineQuery } from "groq";
import { client } from "../client";

// Get replies to a specific comment
export async function getCommentReplies(
  commentId: string,
  userId: string | null
) {
  const getCommentRepliesQuery = defineQuery(`
      *[_type == "comment" && parentComment._ref == $commentId] {
        ...,
        _id,
        content,
        createdAt,
        "author": author->,
        "replies": *[_type == "comment" && parentComment._ref == ^._id],
        "votes": {
            "upvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]),
            "downvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
            "netScore": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
            "voteStatus": *[_type == "vote" && comment._ref == ^._id && user._ref == $userId][0].voteType,
        },
      } | order(votes.netScore desc) //votes.netScore desc -> if you want to sort by net score
    `);

    const result = await client.fetch(getCommentRepliesQuery, { commentId, userId: userId || "" });


  return result || [];
}