import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from 'axios'

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    } catch (error) {
      setErr(error.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Get Your Own Account</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi ipsa
            recusandae quibusdam fugiat velit ad explicabo delectus repellat
            consectetur ex sit, iste debitis numquam autem modi cumque adipisci
            doloribus provident?
          </p>
          <span>Already have one?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              required
              onChange={handleChange}
            />
            {err && (<span style={{color: "red", marginTop: "20px", fontWeight: "500" }}>{err}</span>)}
            <button type="submit" onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
