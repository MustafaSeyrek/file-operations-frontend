import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

export default function Home() {
  const url = "http://localhost:8080/files";
  let anchor = document.createElement("a");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (token == null) {
      navigate("/auth");
    } else {
      loadFiles();
    }
  }, []);

  const loadFiles = async () => {
    try {
      const result = await axios.get(url, {
        headers: { Authorization: token },
      });
      setFiles(result.data);
    } catch (err) {
      if (err.response != null) {
        if (err.response.status == 401) {
          setError("Your session has ended. Please logout and login again!");
        }
      } else {
        setError(err.message);
      }
    }
  };

  const downloadFile = async (path, name) => {
    const result = await axios.get(path, {
      headers: { Authorization: token },
      responseType: "blob",
    });
    let blobby = result.data;
    let objectUrl = window.URL.createObjectURL(blobby);
    anchor.href = objectUrl;
    anchor.download = name;
    anchor.click();
    window.URL.revokeObjectURL(objectUrl);
  };

  const uploadFile = async () => {
    clearMessage();
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedFile != null) {
      if (selectedFile.size > 5000000) {
        setError("Files larger than 5MB cannot be uploaded!");
      } else {
        try {
          const result = await axios.post(url, formData, {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          });
          if (result.data) setSuccess(result.data);
          loadFiles();
        } catch (err) {
          if (err.response != null) setError(err.response.data);
          else setError(err.message);
        }
      }
    } else {
      setError("Please select the file you want to upload!");
    }
  };

  const deleteFile = async (id) => {
    await axios.delete(`${url}/${id}`, {
      headers: { Authorization: token },
    });
    loadFiles();
  };

  const onFileChange = (e) => {
    clearMessage();
    setSelectedFile(e.target.files[0]);
  };

  const clearMessage = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="py-4">
          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            ""
          )}
          {success ? (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          ) : (
            ""
          )}

          <form className="row g-2 mb-3">
            <div className="col-auto">
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={(e) => onFileChange(e)}
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => uploadFile()}
              >
                Upload
              </button>
            </div>
          </form>

          <table className="table border shadow">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Size</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr>
                  <th scope="row">{file.id}</th>
                  <td>{file.name}</td>
                  <td>{file.type}</td>
                  <td>{file.size}B</td>
                  <td>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => downloadFile(file.path, file.name)}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger mx-2"
                      onClick={() => deleteFile(file.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
