import styles from "./Login.module.css";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const url = "https://notes-app-ki1m.onrender.com";

export function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Login response: ", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      navigate("/");
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Log in
        </button>
        <p>
          Dont have an account?{" "}
          <NavLink to="/register">
            <a className={styles.link}>Sign up</a>
          </NavLink>
        </p>
      </form>
    </div>
  );
}
