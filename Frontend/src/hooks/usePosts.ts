import {  useState } from 'react';
import type {Post} from '../types/posts';

export function usePosts(){
    const [posts,setPosts] = useState<Post[]>([]);


const addPost = (author_name: string ,content: string/*,attachement?: attachement */ ): void => {
    const newPost: Post = {
      id: Date.now(),
      author_name,
      content,
    };
    
    setPosts(prev => [newPost, ...prev]) ;
}

    return {
        posts,
        addPost
    };
}

