import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import CreatePost from "../pages/CreatePost";
import PostPage from "../pages/PostPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import EditPostPage from "../pages/EditPostPage";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path = "/post/:postId"  element = {<PostPage />} />

            {/* Protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/CreatePost" element={
                <ProtectedRoute>
                    <CreatePost />
                </ProtectedRoute>} 
            />

            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>} 
            />

            <Route path="/post/:postId/edit" element={
                <ProtectedRoute>
                    <EditPostPage />
                </ProtectedRoute>} 
            />

        </Routes>
    );
};

export default AppRoutes;