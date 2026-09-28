import { useState } from "react";
import { Camera, MessageCircle } from "lucide-react";
import { loginUser } from "../services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = await loginUser(
        username.trim(),
        photo
      );

      localStorage.setItem(
        "chatUser",
        JSON.stringify(user)
      );

      onLogin(user);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to join chat"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-icon">
          <MessageCircle size={30} />
        </div>

        <h1>ChatWave</h1>

        <p className="login-subtitle">
          Join the real-time conversation
        </p>

        <form onSubmit={handleSubmit}>
          <label className="photo-picker">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
              />
            ) : (
              <div className="default-avatar large">
                <Camera size={30} />
              </div>
            )}

            <span>Choose profile photo</span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhoto}
            />
          </label>

          <label className="input-label">
            Username
          </label>

          <input
            className="login-input"
            type="text"
            placeholder="Enter your name"
            value={username}
            maxLength={30}
            onChange={(event) =>
              setUsername(event.target.value)
            }
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            className="join-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Chat"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;