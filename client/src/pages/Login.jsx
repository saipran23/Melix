import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [err, setErr] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setCredentials((prevValues) => {
            return {
                ...prevValues,
                [name]: value
            }
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await login(credentials);
            navigate("/dashboard");

        } catch (err) {
            setErr("Invalid Emaild or password");
        }
    }

    return (
        <div>
            <h2>LOGIN</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" onChange={handleChange} name="email" placeholder="Email" value={credentials.email} />
                <input type="password" onChange={handleChange} name="password" placeholder="Password" value={credentials.password} />
                <button type="submit">Login</button>
            </form>
            <div>
                <button></button>
            </div>
        </div>
    );

}

export default Login;