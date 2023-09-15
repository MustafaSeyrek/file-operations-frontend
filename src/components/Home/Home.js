import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (token == null) {
      navigate("/auth");
    }else{
        setFile("ok");
    }
  }, []);

  return <div>
    <Navbar/>
    Home</div>;
}
