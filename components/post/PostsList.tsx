import { getPosts } from "@/sanity/lib/post/getPosts";
import { currentUser } from "@clerk/nextjs/server";
import Post from "./Post";
import type { GetAllPostsQueryResult } from "@/sanity.types";

async function PostsList() {
  const posts: GetAllPostsQueryResult = await getPosts();
  const user = await currentUser();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post._id} post={post} userId={user?.id || null} />
      ))}
    </div>
  );
}

export default PostsList;