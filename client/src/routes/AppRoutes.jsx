import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import CreatePost from "../pages/CreatePost";

const Dashboard = () => <h1>Dashboard</h1>;
const Home = () => <h1>Home Page</h1>;

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

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
        </Routes>
    );
};

export default AppRoutes;