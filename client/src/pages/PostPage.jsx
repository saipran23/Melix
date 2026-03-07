import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/comments/CommentSection";

function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [postData, setPostData] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [allComments, setAllComments] = useState(null);
    const { user, isAuthenticated } = useAuth();


    const isOwner =
        isAuthenticated &&
        user &&
        postData &&
        user.id === postData.author_id;

    async function fetchPostDetaile() {
        try {
            const result = await axiosInstance.get("/api/posts/" + postId);
            setPostData(result.data);
            console.log(result.data);
        } catch (err) {
            console.log("Post fetch error:", err);
            navigate("/dashboard");
        }
    }

    async function fetchLikeStatus() {

        try {
            const res = await axiosInstance.get(
                "/api/likes/" + postId + "/like-status"
            );

            setIsLiked(res.data.liked);

        } catch (err) {
            console.log("Like status error:", err);

        }
    }


    async function handleLike() {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        const currentLiked = isLiked;

        try {
            if (currentLiked) {
                await axiosInstance.delete("/api/likes/" + postId);

                setPostData((prev) => ({
                    ...prev,
                    like_count: prev.like_count - 1,
                }));
            } else {
                await axiosInstance.post("/api/likes/" + postId);

                setPostData((prev) => ({
                    ...prev,
                    like_count: prev.like_count + 1,
                }));
            }

            setIsLiked(!currentLiked);
        } catch (err) {
            console.log("Like error: ", err);
        }
    }

    async function handleDeletePost() {
        try {

            const result  = await axiosInstance.delete(`/api/posts/${postId}`);

            navigate("/");
            
        } catch (err) {
            console.log("delete post -:", err);
            
        }
    }


    useEffect(() => {

        fetchPostDetaile();
        if (isAuthenticated) {
            fetchLikeStatus();
        }
        
        console.log(isAuthenticated+ "-" + isOwner);


    }, [postId, isAuthenticated]);

    if (!postData) return <p>Loading post...</p>;

    return (
        <div>
            <div className="post-page" >

                <h1>{postData.title}</h1>

                {postData.cover_image && (
                    <img
                        src={`http://localhost:3000/uploads/${postData.cover_image}`}
                        alt="cover"
                        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                    />
                )}

                <div>
                    <h3>Categories:</h3>
                    {postData.categories &&
                        postData.categories.map((cat, i) => (
                            <span key={i} style={{ marginRight: "10px" }}>
                                {cat}
                            </span>
                        ))}
                </div>
                <div>
                    <h3>Tags:</h3>
                    {postData.tags &&
                        postData.tags.map((tag, i) => (
                            <span key={i}>
                                #{tag}
                            </span>
                        ))}
                </div>
                <div
                    className="post-body"
                    dangerouslySetInnerHTML={{ __html: postData && postData.content }}
                ></div>

                <div>
                    <ToggleButton value="like" selected={isLiked} onClick={handleLike}>
                        {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </ToggleButton>

                    <span>
                        {postData.like_count}
                    </span>

                </div>
                <div>
                    <p>Views: {postData.viewcount}</p>
                    <p>Author: {postData.author_name}</p>
                    <p>Updated: {postData.updated_at}</p>
                </div>
            </div>

            <div>

                {isOwner && (

                    <div className="post-actions">

                        <button onClick={() => navigate(`/post/${postId}/edit`)}>
                            Edit
                        </button>

                        <button onClick={handleDeletePost} >
                            Delete
                        </button>

                    </div>
                )}
            </div>

            <div>
                <CommentSection postID={postId} />
            </div>
        </div>
    );
}

export default PostPage;
