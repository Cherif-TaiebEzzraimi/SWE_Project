import { PostForm } from '../components/PostForm';
import { usePosts } from '../hooks/usePosts';
import { Post } from '../types/post';

export function HomePage() {
  const { posts, addPost } = usePosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Posts App
        </h1>

        {/* Form */}
        <PostForm onSubmit={addPost} />

        {/* Minimal Display - Just to Confirm Posts Are Being Added */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Posts ({posts.length})
          </h3>
          
          {posts.length === 0 ? (
            <p className="text-gray-500 italic">No posts yet. Create one above!</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post: Post) => (
                <div 
                  key={post.id} 
                  className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">{post.author}</p>
                  <p className="text-gray-600 text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}