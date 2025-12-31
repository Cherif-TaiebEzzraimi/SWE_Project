import { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';
export interface Post {
	id: number;
	title: string;
	category: string;
	description: string;
	minPrice: number;
	maxPrice: number;
	requirements: string[];
	attachments: string[];
	applicants?: any[];
	userId: number;
}

interface PostsContextType {
	posts: Post[];
	addPost: (post: Omit<Post, 'id'>) => void;
	updatePost: (id: number, post: Omit<Post, 'id'>) => void;
	deletePost: (id: number) => void;
	startEdit: (post: Post) => void;
	editingPost: Post | null;
	clearEdit: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const initialPosts: Post[] = [
	{
		id: 1,
		title: 'Build a React App',
		category: 'Development & IT',
		description: 'We are looking for a skilled React developer to build a modern, scalable web application for our startup. The project involves API integration, authentication, and responsive design. Experience with TypeScript and TailwindCSS is a plus.',
		minPrice: 100,
		maxPrice: 500,
		requirements: ['React', 'TypeScript', 'API Integration', 'TailwindCSS'],
		attachments: ['specs.pdf'],
		applicants: [
			{
				id: 101,
				name: 'Amina Dev',
				avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
			},
			{
				id: 102,
				name: 'Yacine Design',
				avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
			},
		],
		userId: 1,
	},
	{
		id: 2,
		title: 'Logo Design Needed',
		category: 'Design & Creative',
		description: 'Need a creative logo for a new eco-friendly brand. The logo should be minimal, memorable, and work well in both color and monochrome. Please share your portfolio.',
		minPrice: 50,
		maxPrice: 200,
		requirements: ['Logo Design', 'Branding'],
		attachments: [],
		applicants: [
			{
				id: 103,
				name: 'Sara AI',
				avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
			}
		],
		userId: 2,
	},
	{
		id: 3,
		title: 'AI Model for Images',
		category: 'AI Services',
		description: 'Seeking an expert to build an image classification model for a medical dataset. Must have experience with deep learning, PyTorch, and data augmentation. Prior work in healthcare is a plus.',
		minPrice: 300,
		maxPrice: 1000,
		requirements: ['PyTorch', 'Deep Learning', 'Data Augmentation'],
		attachments: ['dataset.zip'],
		applicants: [
			{
				id: 104,
				name: 'Amina Dev',
				avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
			}
		],
		userId: 1,
	},
	{
		id: 4,
		title: 'Translate Marketing Brochure',
		category: 'Writing & Translation',
		description: 'Looking for a translator to convert a 10-page marketing brochure from English to French. Experience in marketing content preferred.',
		minPrice: 80,
		maxPrice: 250,
		requirements: ['Translation', 'Marketing', 'French'],
		attachments: ['brochure.pdf'],
		applicants: [],
		userId: 3,
	},
	{
		id: 5,
		title: 'Customer Support Chatbot',
		category: 'Admin & Customer Support',
		description: 'Need a chatbot for customer support on our e-commerce site. Should handle common queries and escalate to human agents as needed.',
		minPrice: 200,
		maxPrice: 600,
		requirements: ['Chatbot', 'NLP', 'Customer Support'],
		attachments: [],
		applicants: [],
		userId: 4,
	},
	{
		id: 6,
		title: 'Financial Forecasting Spreadsheet',
		category: 'Finance & Accounting',
		description: 'Create a dynamic spreadsheet for 3-year financial forecasting. Must include charts and scenario analysis.',
		minPrice: 120,
		maxPrice: 350,
		requirements: ['Excel', 'Finance', 'Forecasting'],
		attachments: ['template.xlsx'],
		applicants: [],
		userId: 5,
	},
	{
		id: 7,
		title: 'Company Policy Handbook',
		category: 'Legal',
		description: 'Draft a comprehensive company policy handbook. Legal background and HR experience required.',
		minPrice: 400,
		maxPrice: 900,
		requirements: ['Legal Writing', 'HR', 'Policy'],
		attachments: [],
		applicants: [],
		userId: 6,
	},
	{
		id: 8,
		title: '3D Model for Product Prototype',
		category: 'Engineering & Architecture',
		description: 'Design a 3D model for a new consumer electronics prototype. Experience with SolidWorks or Fusion 360 required.',
		minPrice: 250,
		maxPrice: 700,
		requirements: ['3D Modeling', 'SolidWorks', 'Fusion 360'],
		attachments: ['sketch.png'],
		applicants: [],
		userId: 7,
	},
	{
		id: 9,
		title: 'Sales Funnel Optimization',
		category: 'Sales & Marketing',
		description: 'Optimize our digital sales funnel for higher conversion. Must have experience with analytics and A/B testing.',
		minPrice: 150,
		maxPrice: 400,
		requirements: ['Sales', 'Marketing', 'A/B Testing'],
		attachments: [],
		applicants: [],
		userId: 8,
	},
	{
		id: 10,
		title: 'Corporate Training Video',
		category: 'HR & Training',
		description: 'Produce a 10-minute training video for onboarding new employees. Script and voiceover included.',
		minPrice: 300,
		maxPrice: 800,
		requirements: ['Video Production', 'Training', 'Scriptwriting'],
		attachments: ['brief.docx'],
		applicants: [],
		userId: 9,
	},
];

export const PostsProvider = ({ children }: { children: ReactNode }) => {
		const [posts, setPosts] = useState<Post[]>(initialPosts);
		const [editingPost, setEditingPost] = useState<Post | null>(null);

		const addPost = (post: Omit<Post, 'id'>) => {
			setPosts(prev => [
				{ ...post, id: Date.now() },
				...prev,
			]);
		};

		const updatePost = (id: number, post: Omit<Post, 'id'>) => {
			setPosts(prev => prev.map(p => (p.id === id ? { ...post, id } : p)));
			setEditingPost(null);
		};

		const deletePost = (id: number) => {
			setPosts(prev => prev.filter(p => p.id !== id));
			setEditingPost(null);
		};

		const startEdit = (post: Post) => setEditingPost(post);
		const clearEdit = () => setEditingPost(null);

		return (
			<PostsContext.Provider value={{ posts, addPost, updatePost, deletePost, editingPost, startEdit, clearEdit }}>
				{children}
			</PostsContext.Provider>
		);
};

export const usePosts = () => {
	const ctx = useContext(PostsContext);
	if (!ctx) throw new Error('usePosts must be used within a PostsProvider');
	return ctx;
};
