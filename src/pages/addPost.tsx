import React, { useRef, useState } from 'react';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 25;

const categoriesWithSkills = [
  { category: 'Development & IT' },
  { category: 'Design & Creative' },
  { category: 'AI Services' },
  { category: 'Writing & Translation' },
  { category: 'Sales & Marketing' },
];

const AddPostPage: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > MAX_FILES) {
      alert(`You can upload up to ${MAX_FILES} files.`);
      return;
    }
    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`${file.name} exceeds the 25MB size limit.`);
        return;
      }
    }
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDiscard = () => {
    setTitle('');
    setCategory('');
    setBudgetMin('');
    setBudgetMax('');
    setDescription('');
    setFiles([]);
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submit logic
    alert('Post published!');
    handleDiscard();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#f5f7f8] dark:bg-[#101722] py-10 px-4 sm:px-8 md:px-20 xl:px-40 font-sans">
      {/* Page Title */}
      <h1 className="text-4xl font-black text-center mb-8 text-[#0a66f0] dark:text-white drop-shadow-[0_0_12px_rgba(10,102,240,0.25)]">
        Create a New Post
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white dark:bg-[#1C2A3B] rounded-xl border border-[#0a66f0]/20 shadow-[0_0_30px_rgba(10,102,240,0.15)] p-4 sm:p-6 md:p-8 flex flex-col gap-8">
        {/* Title Field */}
        <div>
          <label className="block text-lg font-bold text-[#0a66f0] dark:text-white mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-4 text-base transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
            placeholder="Post title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        {/* Category Field */}
        <div>
          <label className="block text-lg font-bold text-[#0a66f0] dark:text-white mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-4 text-base transition-all"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categoriesWithSkills.map(cat => (
              <option key={cat.category} value={cat.category}>{cat.category}</option>
            ))}
          </select>
        </div>
        {/* Budget Fields */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-lg font-bold text-[#0a66f0] dark:text-white mb-2">
              Budget Min <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-4 text-base transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
              placeholder="Minimum budget"
              value={budgetMin}
              onChange={e => setBudgetMin(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-[#0a66f0] dark:text-white mb-2">
              Budget Max <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-4 text-base transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
              placeholder="Maximum budget"
              value={budgetMax}
              onChange={e => setBudgetMax(e.target.value)}
              required
            />
          </div>
        </div>
        {/* Description Field */}
        <div>
          <label className="block text-lg font-bold text-[#0a66f0] dark:text-white mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full min-h-[9rem] rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-4 text-base transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
            placeholder="Share an update, ask a question, or describe the next task..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        {/* Attachments Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-500">upload_file</span>
            <span className="text-lg font-bold text-[#0a66f0] dark:text-white">Attachments</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-slate-400 mb-3">You can upload up to 5 files (Max 25MB each)</div>
          {/* File List */}
          {files.length > 0 && (
            <ul className="mb-4 space-y-2">
              {files.map((file, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2 group">
                  <span className="material-symbols-outlined text-blue-400 bg-gray-200 dark:bg-slate-700 rounded-md p-1">
                    {file.type.startsWith('image') ? 'image' : 'description'}
                  </span>
                  <span className="truncate max-w-[180px] text-gray-800 dark:text-slate-200">{file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button type="button" onClick={() => handleRemoveFile(idx)} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full p-1">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {/* Upload Area */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl py-8 bg-gray-50 dark:bg-slate-800 cursor-pointer hover:border-blue-400 transition-all mb-2" onClick={handleUploadClick}>
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">upload_file</span>
            <span className="text-gray-500 dark:text-slate-400 font-medium">Upload More Files</span>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept="*"
            />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-6 py-2 rounded-lg font-bold text-base bg-red-100 text-red-700 shadow-[0_0_15px_rgba(185,28,28,0.4)] border-2 border-red-200 hover:bg-red-700 hover:text-white transition-all duration-200"
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-8 py-2 rounded-lg font-bold text-base bg-[#0a65f1] text-white shadow-[0_0_15px_rgba(10,101,241,0.4)] border-2 border-blue-200 hover:bg-blue-800 transition-all duration-200"
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPostPage;
