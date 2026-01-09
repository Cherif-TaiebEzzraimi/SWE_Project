import React, { useRef, useState, useRef as useReactRef } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { categoriesWithSkills } from '../../../components/categories';
import { usePosts } from '../../../context/PostsContext';
import { createDirectHire } from '../../../api/negotiationApi';
import { uploadMedia } from '../../../api/mediaApi';
import { createRequest } from '../../../api/requestApi';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 25;



  const AddPostPage: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const location = useLocation();
  const directHire = location.state?.directHire;
  const directFreelancer = location.state?.freelancer;
  const navigate = useNavigate();
  const USER_ID = 1; // Simulate logged-in user ID (should match dashboard)
  const { addPost, updatePost, deletePost, editingPost, clearEdit } = usePosts();
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const formRef = useReactRef<HTMLFormElement>(null);
  const [title, setTitle] = useState(editingPost ? editingPost.title : '');
  const [category, setCategory] = useState(
    editingPost ? editingPost.category : (directHire && directFreelancer ? directFreelancer.category : '')
  );

  // Ensure category is set to freelancer's category on direct hire (only on initial load)
  const [categoryInitialized, setCategoryInitialized] = React.useState(false);
  React.useEffect(() => {
    if (!editingPost && directHire && directFreelancer && directFreelancer.category && !categoryInitialized) {
      setCategory(directFreelancer.category);
      setCategoryInitialized(true);
    }
  }, [directHire, directFreelancer, editingPost, categoryInitialized]);
  const [budgetMin, setBudgetMin] = useState(editingPost ? String(editingPost.minPrice) : '');
  const [budgetMax, setBudgetMax] = useState(editingPost ? String(editingPost.maxPrice) : '');
  const [description, setDescription] = useState(editingPost ? editingPost.description : '');
  const [files, setFiles] = useState<File[]>([]); // File uploads not persisted for edit
  const [neededSkills, setNeededSkills] = useState<string[]>(editingPost ? editingPost.requirements : []);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Reset form fields to blank when editingPost becomes null (e.g., after Discard)
  React.useEffect(() => {
    if (!editingPost) {
      setTitle(directHire && directFreelancer ? `Direct Hire: ${directFreelancer.name}` : '');
      setCategory(directHire && directFreelancer ? directFreelancer.category : '');
      setCategoryInitialized(false); // Reset initialization flag
      setBudgetMin('');
      setBudgetMax('');
      setDescription('');
      setFiles([]);
      setNeededSkills([]);
      setErrors({});
    }
  }, [editingPost, directHire, directFreelancer]);

  // Clear neededSkills when category changes (unless editing an existing post)
  React.useEffect(() => {
    if (!editingPost) {
      setNeededSkills([]);
    }
  }, [category, editingPost]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get skills for selected category
  const availableSkills = category
    ? (categoriesWithSkills.find(cat => cat.category === category)?.skills || [])
    : [];

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

  const handleDiscard = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    if (editingPost) {
      deletePost(editingPost.id);
    } else {
      clearEdit();
      setTitle('');
      setCategory('');
      setBudgetMin('');
      setBudgetMax('');
      setDescription('');
      setFiles([]);
      setNeededSkills([]);
      setErrors({});
    }
    if (onClose) onClose();
    setShowDiscardModal(false);
    navigate('/client-dashboard');
  };

  const handleAddSkill = (skill: string) => {
    if (!neededSkills.includes(skill)) {
      setNeededSkills(prev => [...prev, skill]);
    }
  // removed setSkillInput
  };

  const handleRemoveSkill = (skill: string) => {
    setNeededSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted!', { directHire, directFreelancer, title, category, budgetMin, budgetMax, description, neededSkills });
    
    const newErrors: {[key:string]: string} = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!budgetMin || isNaN(Number(budgetMin)) || Number(budgetMin) < 100) newErrors.budgetMin = 'Minimum budget must be at least 100 DA.';
    if (!budgetMax || isNaN(Number(budgetMax)) || Number(budgetMax) <= Number(budgetMin)) newErrors.budgetMax = 'Maximum budget must be greater than minimum budget.';
    if (!description || description.trim().length < 30) newErrors.description = 'Description must be at least 30 characters.';
    if (!neededSkills.length) newErrors.neededSkills = 'At least one needed skill is required.';
    
    console.log('Validation errors:', newErrors);
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation failed, showing errors');
      setTimeout(() => {
        const firstErrorField = document.querySelector('[data-error="true"]');
        if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
    console.log('Validation passed, proceeding with submission');
    if (editingPost) {
      updatePost(editingPost.id, {
        title,
        category,
        minPrice: Number(budgetMin),
        maxPrice: Number(budgetMax),
        description,
        requirements: neededSkills,
        attachments: editingPost.attachments || [],
        applicants: editingPost.applicants || [],
        userId: editingPost.userId,
      });
      clearEdit();
      setTitle('');
      setCategory('');
      setBudgetMin('');
      setBudgetMax('');
      setDescription('');
      setFiles([]);
      setNeededSkills([]);
      setErrors({});
      navigate('/client-dashboard');
    } else {
      // Save to backend first
      try {
        const backendRequest = await createRequest({
          title: `${title}\n\nRequired Skills: ${neededSkills.join(', ')}\n\n${description}`,
          category,
          budget_min: Number(budgetMin),
          budget_max: Number(budgetMax),
          attachments: files.map(f => f.name),
        });
        console.log('Request saved to backend:', backendRequest);
      } catch (error) {
        console.error('Failed to save request to backend:', error);
        // Continue anyway to keep local state working
      }

      // Also add to local state for immediate UI update
      addPost({
        title,
        category,
        minPrice: Number(budgetMin),
        maxPrice: Number(budgetMax),
        description,
        requirements: neededSkills,
        attachments: [],
        applicants: [],
        userId: USER_ID,
      });
      setTitle('');
      setCategory('');
      setBudgetMin('');
      setBudgetMax('');
      setDescription('');
      setFiles([]);
      setNeededSkills([]);
      setErrors({});
      if (directHire && directFreelancer) {
        console.log('Creating direct hire negotiation...');
        try {
          // Prepare project details for description
          const projectDetailsText = `Project Title: ${title}\nCategory: ${category}\nBudget: ${budgetMin} - ${budgetMax} DA\nRequired Skills: ${neededSkills.join(', ')}\n\nDescription:\n${description}`;
          
          // Create the negotiation with all project details
          const negotiation = await createDirectHire(directFreelancer.id, {
            client_description: projectDetailsText,
            client_attachments: files.length > 0 ? files.map(f => ({ name: f.name, size: f.size, type: f.type })) : undefined
          });

          console.log('Negotiation created successfully:', negotiation.id);
          
          // Upload files if any were selected
          if (files.length > 0) {
            try {
              console.log('Uploading files...');
              await Promise.all(
                files.map(file => uploadMedia(file, 'negotiation_attachment', negotiation.id))
              );
              console.log('Files uploaded successfully');
            } catch (fileError) {
              console.error('Error uploading files:', fileError);
              // Continue navigation even if file upload fails
            }
          }
          
          navigate(`/project-progress?tab=overview&negotiationId=${negotiation.id}&directHire=1&settingsMode=1`, { 
            state: { 
              directHire: true, 
              freelancer: directFreelancer, 
              negotiationId: negotiation.id,
              post: { 
                title, 
                category, 
                minPrice: Number(budgetMin), 
                maxPrice: Number(budgetMax), 
                description, 
                requirements: neededSkills 
              },
              settingsMode: true,
              initialLoad: true
            } 
          });
        } catch (error: any) {
          console.error('Error creating negotiation:', error);
          const errorMessage = error?.response?.data?.detail || 
                              error?.response?.data?.message || 
                              (typeof error?.response?.data === 'string' ? error.response.data : null) ||
                              error?.message || 
                              'Failed to create negotiation. Please try again.';
          alert(errorMessage);
        }
      } else {
        console.log('Navigating to client-dashboard');
        navigate('/client-dashboard');
      }
    }
  };



  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#f5f7f8] dark:bg-[#101722] py-10 px-4 sm:px-8 md:px-20 2xl:px-[20vw] font-sans">
      {/* Page Title */}
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="w-full max-w-4xl mx-auto bg-white dark:bg-[#1C2A3B] rounded-xl border border-[#0a66f0]/20 shadow-[0_0_30px_rgba(10,102,240,0.15)] p-4 sm:p-6 md:p-8 flex flex-col gap-8 relative">
        {/* Go Back/Cross Button inside modal box */}
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-20 bg-white dark:bg-[#1C2A3B] border border-gray-200 dark:border-slate-700 rounded-full shadow-md p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl text-gray-600 dark:text-slate-300">close</span>
        </button>
        <h1 className="text-4xl font-black text-center mb-8 text-[#0a66f0] dark:text-white drop-shadow-[0_0_12px_rgba(10,102,240,0.25)]">
          {directHire && directFreelancer
            ? `Direct Hire: ${directFreelancer.name}`
            : editingPost
            ? 'Edit Post'
            : 'Create a New Post'}
        </h1>
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
            data-error={!!errors.title}
          />
          {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
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
            data-error={!!errors.category}
          >
            <option value="">Select category</option>
            {categoriesWithSkills.map(cat => (
              <option key={cat.category} value={cat.category}>{cat.category}</option>
            ))}
          </select>
          {errors.category && <div className="text-red-600 text-sm mt-1">{errors.category}</div>}
        </div>
        {/* Needed Skills Field */}
        <div>
          <label className="block text-lg font-bold text-[#0a66f0] dark:text-white mb-2">
            Needed Skills <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {neededSkills.map(skill => (
              <span key={skill} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
                {skill}
                <button type="button" className="ml-2 text-blue-500 hover:text-red-500" onClick={() => handleRemoveSkill(skill)}>
                  &times;
                </button>
              </span>
            ))}
          </div>
          {/* Available skills as selectable tags */}
          <div className="flex flex-wrap gap-2">
            {availableSkills.filter(skill => !neededSkills.includes(skill)).map(skill => (
              <button
                type="button"
                key={skill}
                className="inline-flex items-center bg-gray-100 hover:bg-blue-200 text-blue-700 rounded-full px-3 py-1 text-sm font-medium border border-blue-200 transition-all"
                onClick={() => handleAddSkill(skill)}
              >
                <span className="material-symbols-outlined text-base mr-1">add</span>
                {skill}
              </button>
            ))}
            {(!category || availableSkills.length === 0) && (
              <span className="text-gray-400 text-sm">Select a category to choose skills</span>
            )}
          </div>
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
              data-error={!!errors.budgetMin}
            />
            {errors.budgetMin && <div className="text-red-600 text-sm mt-1">{errors.budgetMin}</div>}
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
              data-error={!!errors.budgetMax}
            />
            {errors.budgetMax && <div className="text-red-600 text-sm mt-1">{errors.budgetMax}</div>}
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
            data-error={!!errors.description}
          />
          {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
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
            onClick={() => {
              console.log('Submit button clicked', { directHire, directFreelancer });
              // Ensure form submission isn't prevented
              if (formRef.current) {
                const form = formRef.current;
                const isValid = form.checkValidity();
                console.log('Form validity:', isValid);
                if (!isValid) {
                  form.reportValidity();
                }
              }
            }}
            className="px-8 py-2 rounded-lg font-bold text-base bg-[#0a65f1] text-white shadow-[0_0_15px_rgba(10,101,241,0.4)] border-2 border-blue-200 hover:bg-blue-800 transition-all duration-200"
          >
            {directHire && directFreelancer ? 'Confirm' : editingPost ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
        {/* Discard Confirmation Modal */}
        <ConfirmModal
          open={showDiscardModal}
          title="Discard Changes?"
          message="Are you sure you want to discard this post? All unsaved changes will be lost."
          confirmText="Discard"
          cancelText="Cancel"
          onCancel={() => setShowDiscardModal(false)}
          onConfirm={confirmDiscard}
        />
      </form>
    </div>
  );
}
export default AddPostPage;