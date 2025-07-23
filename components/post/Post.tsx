import {
    GetAllPostsQueryResult,
    GetPostsForSubredditQueryResult,
  } from "@/sanity.types";
  import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
  import { getUserPostVoteStatus } from "@/sanity/lib/vote/getUserPostVoteStatus";
  import { getPostComments } from "@/sanity/lib/vote/getPostComments";
  import TimeAgo from "../TimeAgo";
  import Image from "next/image";
  import { urlFor } from "@/sanity/lib/image";
  import PostActions from "./PostActions";
  import ReactMarkdown from 'react-markdown';
  import PostFooter from "./PostFooter";
  
  interface PostProps {
    post:
      | GetAllPostsQueryResult[number]
      | GetPostsForSubredditQueryResult[number];
    userId: string | null;
  }
  
  async function Post({ post, userId }: PostProps) {
    const votes = await getPostVotes(post._id);
    const vote = await getUserPostVoteStatus(post._id, userId);
    const comments = await getPostComments(post._id, userId);
  
    return (
      <article
        key={post._id}
        className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
      >
        <div className="flex flex-col">
          {/* Post Content */}
          <div className="flex-1 p-3 md:p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {post.subreddit && (
                  <>
                    <a
                      href={`/community/${post.subreddit.slug}`}
                      className="font-medium hover:underline"
                    >
                      c/{post.subreddit.title}
                    </a>
                    <span>•</span>
                    <span>Posted by</span>
                    {post.author && (
                      <a
                        href={`/u/${post.author.username}`}
                        className="hover:underline"
                      >
                        u/{post.author.username}
                      </a>
                    )}
                    <span>•</span>
                    {post.publishedAt && (
                      <TimeAgo date={new Date(post.publishedAt)} />
                    )}
                  </>
                )}
              </div>
              {/* Post Actions (Summarize, Report, Delete) */}
              <PostActions
                  postId={post._id}
                  postBody={post.body?.[0]?.children?.[0]?.text || ""}
                  postOwnerId={post.author?._id || ""}
              />
            </div>

            {post.subreddit && (
              <div>
                <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                  {post.title}
                </h2>
              </div>
            )}

            {post.body && (
              <div className="prose prose-sm max-w-none mb-3">
                <ReactMarkdown>
                  {post.body?.map((block) => 
                    block.children?.map((span) => span.text || '').join('') || ''
                  ).join('\n\n')}
                </ReactMarkdown>
              </div>
            )}

            {post.image && post.image.asset?._ref && (
              <div className="relative aspect-video max-h-[512px] w-full mb-3 bg-gray-100">
                <Image
                  src={urlFor(post.image).url()}
                  alt={post.image.alt || "Post image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw"
                />
              </div>
            )}

            <PostFooter 
              postId={post._id} 
              votes={votes} 
              vote={vote} 
              commentCount={post.commentCount || 0}
              comments={comments}
            />
          </div>
        </div>
      </article>
    );
  }
  
  export default Post;