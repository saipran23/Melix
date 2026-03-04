import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import RichEditor from "../components/RichEditor";
import "./CreatePost.css";


function CreatePost() {
    const navigate = useNavigate();

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
    // cover-image Section
    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [content, setContent] = useState("");

    const [status, setStatus] = useState("draft");

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


    function handleCoverUpload(e) {
        const file = e.target.files[0];

        if (!file) return;

        setCoverImage(file);
        setPreview(URL.createObjectURL(file));
    }

    function removeCover() {
        setCoverImage(null);
        setPreview(null);
    }

    // publish  controls

    async function handleSubmit(postStatus) {
        try {

            if (!title.trim()) {
                setErr("Title is required");
                return;
            }

            if (!content.trim()) {
                setErr("Content cannot be empty");
                return;
            }

            const formData = new FormData();

            formData.append("title", title);
            formData.append("content", content);
            formData.append("status", postStatus);

            formData.append("tags", JSON.stringify(tags));
            formData.append("categories", JSON.stringify(categories));

            if (coverImage) {
                formData.append("cover_image", coverImage);
            }

            const res = await axiosInstance.post("/api/posts", formData);

            console.log(res);
            navigate(`/post/${res.data.post_id}`);

        } catch (error) {
            console.error(error);
            setErr("Failed to create post");
        }
    }

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

            <div className="cover-image-section">
                {!preview ? (
                    <label className="cover-upload">
                        Add a cover image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            hidden
                        />
                    </label>
                ) : (
                    <div className="cover-preview">
                        <img src={preview} alt="Cover Preview" />

                        <button
                            type="button"
                            onClick={removeCover}
                            className="remove-cover"
                        >
                            Remove Cover
                        </button>
                    </div>
                )}
            </div>

            <div className=" rich-editor-section">
                <RichEditor value={content} onChange={setContent} />
            </div>

            <div className="publish-controls">
                <button onClick={() => handleSubmit("published")}>
                    Publish Post
                </button>

                <button onClick={() => handleSubmit("draft")}>
                    Save Draft
                </button>
            </div>


        </div>
    );
}

export default CreatePost;