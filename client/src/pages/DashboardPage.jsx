import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import PostCard from "../components/Post/PostCard";

function DashboardPage() {

    const [dashboard, setDashboard] = useState(null);
    const [userPosts, setUserPosts] = useState(null);
    const [publishedPosts, setPublishedPosts] = useState([]);
    const [draftPosts, setDraftPosts] = useState([]);


    useEffect(() => {
        fetchDashBoard();
        fetchUserPosts();
    }, []);

    async function fetchDashBoard() {
        try {
            const result = await axiosInstance.get("/api/posts/dashboard");
            setDashboard(result.data);

        } catch (err) {
            console.log("fetch dashboard: ", err);

        }
    }

    async function fetchUserPosts() {

        try {
            const result = await axiosInstance.get("/api/posts/user/posts");
            setUserPosts(result.data);

            const posts = result.data;
            const published = posts.filter(
                (post) => post.status === "published"
            );

            const drafts = posts.filter(
                (post) => post.status === "draft"
            );
            console.log(result.data);

            setDraftPosts(drafts);
            setPublishedPosts(published);

        } catch (err) {
            console.log("fetch user posts -: ", err);

        }

    }




    if (!dashboard) return <p>Loading DashBoard ...</p>

    return (
        <div>
            <div>
                <div>
                    <h1>DashBoard</h1>
                </div>

                <div>
                    <h3>Total Posts: <span>{dashboard.total_posts}</span></h3>
                    <h3>Published Posts: <span>{dashboard.published_posts}</span></h3>
                    <h3>Draft Posts: <span>{dashboard.draft_posts}</span></h3>
                    <h3>Total Views: <span>{dashboard.total_views}</span></h3>
                    <h3>Total Likes: <span>{dashboard.total_likes}</span></h3>
                    <h3>Total Comments: <span>{dashboard.total_comments}</span></h3>
                </div>
            </div>
            <div>

                <div className="dashboard-posts">

                    <h2>Published Posts</h2>

                    {publishedPosts.length === 0 && (
                        <p>No published posts yet.</p>
                    )}

                    {publishedPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            cover_image={post.cover_image}
                            viewCount={post.viewcount}
                            author_name={post.author_name}
                            like_count={post.like_count}
                            tags={post.tags}
                            authorId = {post.author_id}
                        />
                    ))}

                </div>

                {/* Draft Posts */}

                <div className="dashboard-drafts">

                    <h2>Draft Posts</h2>

                    {draftPosts.length === 0 && (
                        <p>No draft posts.</p>
                    )}

                    {draftPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            cover_image={post.cover_image}
                            viewCount={post.viewcount}
                            author_name={post.author_name}
                            like_count={post.like_count}
                            tags={post.tags}
                            authorId = {post.author_id}
                        />
                    ))}

                </div>


            </div>

        </div>
    );
}

export default DashboardPage;