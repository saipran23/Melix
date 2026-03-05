import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";


function CommentSection({ postID }) {
    const [allComments, setAllComments] = useState(null);
    const [err, setErr] = useState("");
    const { user } = useAuth();


    async function fetchComments() {
        try {
            const result = await axiosInstance.get("/api/comments/" + postID);
            setAllComments(result.data);
            console.log(result.data);

        } catch (err) {
            console.log("get - comments: ", err);
            setErr("Error while loading the comments");
        }
        // console.log(user);


    }

    async function deleteComment(commentId) {
        try {
            await axiosInstance.delete("/api/comments/" + postID + "/" + commentId);
            setAllComments(prev =>
                prev.filter(comment => comment.id !== commentId)
            );

        } catch (err) {
            console.log("delete - comment: ", err);
        }
    }

    async function addComment(content) {

        try {
            const data = {
                content: content,
                post_id: postID,
                user_id: user.id
            }
            const result = await axiosInstance.post("/api/comments/" + postID, data);
            console.log(result.data);

            setAllComments(prev => [result.data, ...prev]);

        } catch (err) {
            console.log("add - comment: ", err);

        }
    }

    async function editComment(commentId , comment) {
        try {
            const data = {content: comment}
            const result = await axiosInstance.put(`/api/comments/${postID}/${commentId}`, data);

            setAllComments((prev)=>
                prev.map( comment => comment.id === commentId ? result.data : comment)
            );
            
        } catch (err) {
            console.log("edit - comment: ", err);
        }
        
    }

    useEffect(() => {
        fetchComments();
    }, [postID]);

    if (!allComments) return <p>Loading comments...</p>;
    if (allComments.length === 0)
        return (
            <div>
                <CommentForm user={user} addComment={addComment} />
                <p>No comments yet.</p>
            </div>
        );
    return (
        <div>
            <div>
                <CommentForm user={user} addComment={addComment} />
            </div>
            <div>
                {allComments && allComments.map((comment) => {
                    return (
                        <CommentItem
                            key={comment.id}
                            id={comment.id}
                            user_id={comment.user_id}
                            profileimage={comment.profileimage}
                            author_name={comment.author_name}
                            content={comment.content}
                            created_at={comment.created_at}
                            currentUser={user}
                            deleteComment={deleteComment}
                            editComment = {editComment}
                        />);
                })}
            </div>
        </div >
    );
}

export default CommentSection;