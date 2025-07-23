import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getPosts(sortBy: "publishedAt" | "voteScore" | "hot" = "publishedAt") {
  const getAllPostsQuery =
    defineQuery(`*[_type == "post" && isDeleted != true] {
    _id,
    title,
    "slug": slug.current,
    body,
    publishedAt,
    "author": author->,
    "subreddit": subreddit->,
    image,
    isDeleted,
    "voteScore": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),
    "hot": round(count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]) / (dateTime(now()) - dateTime(publishedAt))),
    "commentCount": count(*[_type == "comment" && post._ref == ^._id])
  } | order(${sortBy} desc)`);

  const posts = await sanityFetch({ query: getAllPostsQuery });
  return posts.data;
}