import "./Account.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [err, setErr] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="formBackground">
      <div className="formContainer">
        <div className="formWrapper login">
          <span className="logo">Jingyang Chat</span>
          <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="enter email" />
            <input
              type="password"
              name="password"
              autoComplete="on"
              placeholder="enter password"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <button>Sign in</button>
            {err && (
              <p className="errorMessage" style={{ color: "red" }}>
                Whoops, Wrong Password.
              </p>
            )}
          </form>
          <p className="form-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
        <div className="rabbit">
          <div className="rabbitear">
            <div
              className={`ear-left ${focused ? "earLFocused" : "earLNormal"}`}
            ></div>
            <div
              className={`ear-right ${focused ? "earRFocused" : "earRNormal"}`}
            ></div>
            <div className="rabbitbody">
              <div className="rabbiteye-left"></div>
              <div className="rabbiteye-right"></div>
              <div className="rabbitnose"></div>
              <div
                className={`rabbitmouth ${
                  focused ? "mouthFocused" : "mouthNormal"
                }`}
              ></div>
              <div
                className={`rabbithand-left ${
                  focused ? "handLFocused" : "handLNormal"
                }`}
              ></div>
              <div
                className={`rabbithand-right ${
                  focused ? "handRFocused" : "handRNormal"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
