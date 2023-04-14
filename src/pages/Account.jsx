import { useState, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import ProgressBar from "../components/ProgressBar";
import validateForm from "../utili/validateForm";

import "./Account.css";
import add from "/images/image.png";

function Account() {
  const [err, setErr] = useState(false);
  const [progress, setProgress] = useState(0);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    password: "",
    file: "",
  };
  const updateForm = (state, action) => {
    switch (action.type) {
      case "CHANGE_FORM":
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(updateForm, initialState);
  const { errors, isValid } = validateForm(state);
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_FORM",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          console.log("Upload is " + progress + "% done");
        }, //add progress bar
        (error) => {
          console.log("Error upload file", error);
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // console.log({ downloadURL });
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //collect users
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            //collect user chats
            await setDoc(doc(db, "userChats", res.user.uid), {});
            //need a transition animation?
            navigate("/");
          });
        }
      );
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="formBackground">
      <div className="formContainer">
        <div className="formWrapper">
          <div className="logo">Jingyang Chat</div>
          <span className="title">Register</span>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="enter name"
              required
              onChange={handleChange}
              name="name"
              value={state.name}
            />
            <div className="errorMessages">{state.name && errors.name}</div>
            <input
              type="email"
              placeholder="enter email"
              required
              onChange={handleChange}
              name="email"
              value={state.email}
            />
            <div className="errorMessages">{state.email && errors.email}</div>
            <input
              type="password"
              name="password"
              autoComplete="on"
              placeholder="enter password"
              required
              value={state.password}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <div className="errorMessages">
              {state.password && errors.password}
            </div>
            <input
              style={{ display: "none" }}
              type="file"
              id="file"
              onChange={handleChange}
              name="file"
              value={state.file}
              required
            />
            <label htmlFor="file">
              <img src={add} alt="add" />
              {state.file ? (
                state.file
              ) : (
                <span>
                  Add an Avatar <em>(Required)</em>
                </span>
              )}
            </label>
            <div className="errorMessages">{state.file && errors.file}</div>
            {progress !== 0 && <ProgressBar percent={progress} />}
            <button disabled={!validateForm(state).isValid}>Sign up</button>
          </form>
          <p className="form-footer">
            Have an Account? <Link to="/login">Login</Link>
          </p>
          {err && (
            <p className="errorMessages">
              Whoops, Something Went Wrong, E-mail exists.
            </p>
          )}
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
export default Account;
