import React, { useState } from "react";

function CommentItem(props) {

    const isOwner = props.currentUser && props.currentUser.id === props.user_id;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(props.content);

    async function handleDelete(event) {
        event.preventDefault();
        props.deleteComment(props.id)
    }

    async function handleEdit() {
        setIsEditing(true);
    }

    async function handleChange(event) {
        setEditContent(event.target.value);
    }

    async function handleCancel() {
        setEditContent(props.content);
        setIsEditing(false);
    }

    async function handleSave(event) {
        event.preventDefault();
        props.editComment(props.id, editContent);
        handleCancel();
    }



    return (
        <div >

            <div className="comment-header">
                <img src={props.profileimage} width="30" />
                <span>{props.author_name}</span>
            </div>

            {!isEditing && (
                <div>
                    {props.content}
                </div>
            )}

            {(isEditing && (
                <form onSubmit={handleSave}>
                    <textarea
                        value={editContent}
                        onChange={handleChange}
                        autoFocus
                    />

                    <div className="comment-actions">
                        <button type="submit" >Save</button>

                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            ))}
            {!isEditing && (
                <div>
                    {props.created_at}
                </div>
            )}

            {isOwner && !isEditing && (
                <div className="comment-actions">
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default CommentItem;