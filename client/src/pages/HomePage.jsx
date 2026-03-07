import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import PostCard from "../components/Post/PostCard";

function HomePage() {

    const [allPosts, setAllPosts] = useState(null);

    useEffect(() => {
        fetchAllPosts();
    }, []);

    async function fetchAllPosts() {
        try {

            const result = await axiosInstance.get("/api/posts/");
            setAllPosts(result.data);
            console.log(result.data);

        } catch (err) {
            console.log("feth all posts: ", err);
        }
    }
    if (!allPosts) return (<p>Loading HomePage...</p>);

    return (
        <div>
            {allPosts.map((post) => {
                return <PostCard
                    key = {post.id}
                    id = {post.id}
                    title={post.title}
                    cover_image={post.cover_image}
                    viewCount={post.viewcount}
                    author_name={post.author_name}
                    like_count={post.like_count}
                    tags = {post.tags}
                    authorId = {post.author_id}
                />
            })}
        </div>
    );


}

export default HomePage;