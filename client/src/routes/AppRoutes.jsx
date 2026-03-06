import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import CreatePost from "../pages/CreatePost";
import PostPage from "../pages/PostPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";

const Dashboard = () => <h1>Dashboard</h1>;

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
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/CreatePost" element={
                <ProtectedRoute>
                    <CreatePost />
                </ProtectedRoute>} />

            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;