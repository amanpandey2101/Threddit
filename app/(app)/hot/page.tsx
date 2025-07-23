import PostsList from "@/components/post/PostsList";

export default function HotPage() {
  return (
    <>
      {/* Banner */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">Hot & Controversial Posts</h1>
              <p className="text-sm text-gray-600">
                Posts from all communities, ranked by hotness and controversy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4">
            <PostsList sortBy="hot" />
          </div>
        </div>
      </section>
    </>
  );
} 