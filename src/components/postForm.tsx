import { useState } from 'react';
import type { ChangeEvent } from 'react';

// Define props interface - TypeScript enforces this
interface PostFormProps {
  onSubmit: (author: string, content: string) => void;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [author, setAuthor] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = (): void => {
    // Validation
    if (!author.trim() || !content.trim()) {
      alert('Please fill in both fields!');
      return;
    }
    onSubmit(author, content);
    // Clear form
    setAuthor('');
    setContent('');
  };

  // ChangeEvent<HTMLInputElement> tells TypeScript what event type to expect
  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAuthor(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create a New Post
      </h2>
      <div className="space-y-4">
        {/* Author Input */}
        <div>
          <label 
            htmlFor="author" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Name
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={handleAuthorChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Post Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="What's on your mind?"
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default PostForm;