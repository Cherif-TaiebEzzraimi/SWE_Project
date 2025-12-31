// import { useState } from 'react';
// import { X } from 'lucide-react';

// interface AddNoteModalForPhasesProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAdd: (category: 'general' | 'prework' | 'private', title: string, content: string) => void;
// }

// export const AddNoteModalForPhases = ({ isOpen, onClose, onAdd }: AddNoteModalForPhasesProps) => {
//   const [step, setStep] = useState<'category' | 'form'>('category');
//   const [selectedCategory, setSelectedCategory] = useState<'general' | 'prework' | 'private'>('general');
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');

//   const handleClose = () => {
//     setStep('category');
//     setTitle('');
//     setContent('');
//     onClose();
//   };

//   const handleCategorySelect = (category: 'general' | 'prework' | 'private') => {
//     setSelectedCategory(category);
//     setStep('form');
//   };

//   const handleSubmit = () => {
//     if (title.trim() && content.trim()) {
//       onAdd(selectedCategory, title, content);
//       handleClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={handleClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <X size={24} />
//         </button>

//         {step === 'category' && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Choose Note Category</h2>
//             <div className="space-y-3">
//               <button
//                 onClick={() => handleCategorySelect('general')}
//                 className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 General Notes
//               </button>
//               <button
//                 onClick={() => handleCategorySelect('prework')}
//                 className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Pre-Work Notes
//               </button>
//               <button
//                 onClick={() => handleCategorySelect('private')}
//                 className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
//               >
//                 Private Notes
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 'form' && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold">
//                 Add {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Note
//               </h2>
//               <button
//                 onClick={() => setStep('category')}
//                 className="text-sm text-blue-500 hover:text-blue-700"
//               >
//                 Change Category
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Title</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter note title"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Description</label>
//                 <textarea
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   rows={4}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter note description"
//                 />
//               </div>

//               <div className="flex gap-3 justify-end">
//                 <button
//                   onClick={handleClose}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={!title.trim() || !content.trim()}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                 >
//                   Add Note
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { X } from 'lucide-react';

interface AddNoteModalForPhasesProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: 'general' | 'prework' | 'private', title: string, content: string) => void;
}

export const AddNoteModalForPhases = ({ isOpen, onClose, onAdd }: AddNoteModalForPhasesProps) => {
  const [step, setStep] = useState<'category' | 'form'>('category');
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'prework' | 'private'>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleClose = () => {
    setStep('category');
    setTitle('');
    setContent('');
    onClose();
  };

  const handleCategorySelect = (category: 'general' | 'prework' | 'private') => {
    setSelectedCategory(category);
    setStep('form');
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onAdd(selectedCategory, title, content);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#ffffff] rounded-lg p-6 w-full max-w-md relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#172554] hover:text-[#b91c1c] transition-colors"
        >
          <X size={24} />
        </button>

        {step === 'category' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#172554]">Choose Note Category</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleCategorySelect('general')}
                className="w-full px-4 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#0a65f1] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                General Notes
              </button>
              <button
                onClick={() => handleCategorySelect('prework')}
                className="w-full px-4 py-3 bg-[#49cfe0] text-white rounded-lg hover:bg-[#e0f8fb] hover:text-[#172554] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Pre-Work Notes
              </button>
              <button
                onClick={() => handleCategorySelect('private')}
                className="w-full px-4 py-3 bg-[#b91c1c] text-white rounded-lg hover:bg-[#e7b5b5] hover:text-[#b91c1c] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Private Notes
              </button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#172554]">
                Add {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Note
              </h2>
              <button
                onClick={() => setStep('category')}
                className="text-sm text-[#0a65f1] hover:text-[#1e3a8a] transition-colors"
              >
                Change Category
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#172554]">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#e0f8fb] rounded-lg focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] bg-[#f1f5f9] text-[#172554] transition-all"
                  placeholder="Enter note title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[#172554]">Description</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-[#e0f8fb] rounded-lg focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] bg-[#f1f5f9] text-[#172554] transition-all"
                  placeholder="Enter note description"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-[#f1f5f9] text-[#172554] rounded-lg hover:bg-[#e0f8fb] transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !content.trim()}
                  className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#0a65f1] transition-all duration-300 disabled:bg-[#f1f5f9] disabled:text-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}