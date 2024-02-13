import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    
    const navigate = useNavigate();
    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token === null) {
            navigate("/login");
        } else {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <div>HomePage</div>
        </>
    );
};

export default HomePage;