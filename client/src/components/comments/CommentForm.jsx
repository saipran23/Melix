import React, { useState } from "react";


function CommentForm({ user, addComment }) {

    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLength, setIsLength] = useState(true);

    // if (!user) {
    //     navigate("/login");
    //     return;
    // }

    function handleChange(event){
        setContent(event.target.value);
        if(content.trim().length > 0){
            setIsLength(false);
        }
    }

    function handleCancel() {
        setContent("");
        setIsEditing(false);
        setIsLength(false);
    };

    function handleSubmit(event) {
        event.preventDefault();
        if(!content.trim()) return;
        addComment(content);

        handleCancel();
    }

    return (
        <div>
            {!isEditing && (
                <textarea
                    placeholder="Write a comment..."
                    onFocus={() => setIsEditing(true)}
                    onChange={handleChange}
                />
            )}

            {isEditing && (
                <form onSubmit={handleSubmit}>

                    <textarea
                        value={content}
                        onChange={handleChange}
                        placeholder="Write a comment..."
                        autoFocus
                    />

                    <div className="comment-actions">
                        <button type="submit" disabled={isLength}>Post Comment</button>

                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>

                </form>
            )}
        </div>
    );
}

export default CommentForm;