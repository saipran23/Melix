import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    function handleSearch(event) {
        const { value } = event.target;
        setSearch(value);
    }

    function handleSubmit() {

    }

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    const drop_menu = (
        <>
            {isAuthenticated && (<div><span>{user.name}</span></div>)}
            <button className="menu-btn" onClick={() => setOpen(!open)}>
                ☰
            </button>
            {open &&
                <>
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                        Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setOpen(false)}>
                        Profile
                    </Link>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </>
            }
        </>
    )

    const login = (
        <>
            <Link to="/login" onClick={() => setOpen(false)}>
                Login
            </Link>
        </>
    )


    return (
        <nav className="navbar">
            <div><Link to="/">Melix</Link></div>

            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" onChange={handleSearch} name="search" placeholder="search" value={search} />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div>
                {isAuthenticated ? drop_menu : login}
            </div>
        </nav>
    );
}


export default Navbar;