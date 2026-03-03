import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Tiptap from "../components/RichEditor";
import "./CreatePost.css";


function CreatePost() {
    // tittle section
    const [title, setTitle] = useState("");
    // error display
    const [err, setErr] = useState("");
    // tags section
    const [tagName, setTagName] = useState("");
    const [tags, setTags] = useState([]);
    // categories section
    const [categorieName, setCategoriesName] = useState("");
    const [categories, setCategories] = useState([]);

    // tags secction
    function handleTagKeyDown(event) {
        if (event.key !== "Enter") return;
        event.preventDefault();

        let formattedTag = tagName.trim().toLowerCase();
        if (!formattedTag) return;
        if (tags.length >= 7) {
            setErr("Maximum 7 tags allowed.");
            return;
        }
        if (tags.includes(formattedTag)) {
            setErr("Tag already added.");
            return;
        }
        setTags((prev) => [...prev, formattedTag]);
        setTagName("");
        setErr("");
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // categories section 

    function handleCategoriesKeyDown(event) {
        if (event.key !== "Enter") return;
        event.preventDefault();

        let cat = categorieName.trim().toLocaleLowerCase();
        if (!cat) return;

        if (categories.length >= 3) {
            setErr("Maximum 3 Categories allowed");
            return;
        }

        if (categories.includes(cat)) {
            setErr("Category already added");
            return;
        }

        setCategories((prevValues) => [...prevValues, cat]);
        setCategoriesName("");
        setErr("");
    }

    const removeCategorie = (categorieToRemove) => {
        setCategories(categories.filter((cat) => cat !== categorieToRemove));
    };

    return (
        <div className="create">

            <div className="title">
                <input type="text" onChange={(event) => { setTitle(event.target.value) }} name="title" placeholder="New post title here..." value={title} />
            </div>
{/* ---------tags section */}
            <div className="tag-section">
                <input
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="e.g. react, backend, design..."
                    className="tag-input"
                />

                <div className="tag-pills">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag-pill">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="remove-tag"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                {err && <p className="tag-error">{err}</p>}
            </div>
{/* --------- category section*/}
            <div className="category-section">
                <input
                    type="text"
                    value={categorieName}
                    onChange={(e) => setCategoriesName(e.target.value)}
                    onKeyDown={handleCategoriesKeyDown}
                    placeholder=""
                    className="categorie-input"
                />

                <div className="categories-pills">
                    {categories.map((cat, index) => (
                        <span key={index} className="tag-pill">
                            {cat}
                            <button
                                type="button"
                                onClick={() => removeCategorie(cat)}
                                className="remove-categorie"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

            </div>

            <div className="cover-image-sction">
                <Tiptap />
            </div>

            <div className=" rich-editor-section">

            </div>

            <div className="publish-controls">

            </div>


        </div>
    );
}

export default CreatePost;