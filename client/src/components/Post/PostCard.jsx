import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./PostCard.css";

function PostCard(props) {

    return (
        <div>
            <Link to={`/post/${props.id}`}>
                <div className="image-wrapper">
                    <img
                        src={
                            (props.cover_image
                                ? `http://localhost:3000/uploads/${props.cover_image}?w=400&h=300&fit=crop`
                                : "/DefaultPostCard.png?w=400&h=300&fit=crop")
                        }
                        alt="cover_Image"
                    />
                    <div className="title-overlay">
                        <h3>{props.title}</h3>
                        <div className="meta">
                            <span>{props.viewCount} Views</span>
                            <span>❤️ {props.like_count}</span>
                        </div>
                    </div>
                </div>
                <div className="content">
                    {props.tags && props.tags.map((tag, i) => (
                        <span key={i}>{tag}</span>
                    ))}
                    <span>{props.author_name}</span>
                    <div className="read-more">Read full article →</div>
                </div>
            </Link>
        </div>
    );
}

export default PostCard;

