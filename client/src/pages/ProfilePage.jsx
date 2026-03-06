import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";


function ProfilePage() {

    const { user, isAuthenticated, logout } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showFileInput, setShowFileInput] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("");
    const [bioCount, setBioCount] = useState(0);
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const fileInputRef = useRef(null);


    useEffect(() => {
        fetchUserDetails();
    }, [])


    async function fetchUserDetails() {
        try {
            const result = await axiosInstance.get(`/api/users/${user.id}`);
            setUserProfile(result.data);

            setName(result.data.name || "");
            setBio(result.data.bio || "");
            setBioCount((result.data.bio || "").length);
            setGender(result.data.gender || "preferNotToSay");
            console.log(result.data);

        } catch (err) {
            console.log("fetch user :", err);
        }
    }

    async function handleImageChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));
    }

    async function changeProfileImage(e) {

        e.preventDefault();

        if (!selectedImage) return;

        const formData = new FormData();

        formData.append("profile_image", selectedImage);

        try {

            const res = await axiosInstance.patch(
                `/api/users/${user.id}/profile-picture`,
                formData
            );

            console.log(res.data);

            setUserProfile(prev => ({
                ...prev,
                profile_image: res.data.profile_image
            }));

            setPreview(null);
            setSelectedImage(null);
            setShowFileInput(false);

        } catch (err) {
            console.log("profile image update error:", err);
        }
    }

    async function removeProfileImage() {
        try {

            await axiosInstance.patch(`/api/users/${user.id}/remove-profile-picture`);

            setUserProfile(prev => ({
                ...prev,
                profile_image: null
            }));


        } catch (err) {
            console.log("remove image error:", err);
        }
    }

    function openFileSelector() {
        setShowFileInput(true);
        fileInputRef.current.click();
    }


    async function updateProfile() {

        try {

            const data = {
                name,
                bio,
                gender
            };

            await axiosInstance.patch(
                `/api/users/${user.id}/profile`,
                data
            );

            setUserProfile(prev => ({
                ...prev,
                name,
                bio,
                gender
            }));

            setIsEditing(false);

        } catch (err) {
            console.log("update profile error:", err);
        }
    }

    async function updateProfile() {

        try {

            const data = {
                name,
                bio,
                gender
            };

            await axiosInstance.patch(
                `/api/users/${user.id}/profile`,
                data
            );

            setUserProfile(prev => ({
                ...prev,
                name,
                bio,
                gender
            }));

            setIsEditing(false);

        } catch (err) {
            console.log("update profile error:", err);
        }
    }


    if (!userProfile) return <p>Loading profile...</p>;


    return (
        <div className="profile-page">

            <h2>My Profile</h2>

            <div className="profile-container">

                <div className="profile-image">

                    <img
                        src={
                            preview ||
                            (userProfile?.profile_image
                                ? `http://localhost:3000/uploads/${userProfile.profile_image}`
                                : "/defaultProfileImage.jpg")
                        }
                        alt="profile"
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />

                </div>

                <div>

                    <button onClick={openFileSelector}>
                        Change Profile Image
                    </button>

                    {userProfile.profile_image && (
                        <button onClick={removeProfileImage}>
                            Remove Profile Image
                        </button>
                    )}

                </div>

                <form onSubmit={changeProfileImage}>

                    {showFileInput && (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleImageChange}
                            />

                            <button type="submit">
                                Upload Image
                            </button>
                        </>
                    )}

                </form>


                <div className="profile-info">

                    {!isEditing && <h3>{userProfile.name}</h3>}

                    {isEditing && (
                        <div>
                            <label htmlFor="name">Name:</label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength="50"
                            />
                        </div>
                    )}


                    {!isEditing && (
                        <p>{userProfile.bio || "No bio added yet."}</p>
                    )}

                    {isEditing && (
                        <div>

                            <label htmlFor="bio">Bio:</label>

                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => {
                                    setBio(e.target.value);
                                    setBioCount(e.target.value.length);
                                }}
                                maxLength="500"
                            />

                            <p>{bioCount}/500</p>

                        </div>
                    )}


                    {!isEditing && (
                        <p>
                            {userProfile.gender
                                ? userProfile.gender
                                : "Prefer not to say"}
                        </p>
                    )}

                    {isEditing && (
                        <div>

                            <label htmlFor="gender">Gender:</label>

                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="preferNotToSay">
                                    Prefer not to say
                                </option>
                            </select>

                        </div>
                    )}



                    <p>{userProfile.email}</p>

                    <p>
                        Joined: {new Date(userProfile.created_at).toLocaleDateString()}
                    </p>

                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    )}

                    {isEditing && (
                        <div>

                            <button onClick={updateProfile}>
                                Save
                            </button>

                            <button onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );

}

export default ProfilePage;