import { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  getDoc,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    let timeoutId;
    if (err) {
      timeoutId = setTimeout(() => {
        setErr(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [err]);

  const handleSearch = async () => {
    const users = collection(db, "users");
    const q = query(users, where("displayName", "==", username));
    const notIn = query(users, where("displayName", "!==", username));
    if (notIn) {
      setUser(null);
      setErr(true);
    } //add this 'notIn' condition or it does not work
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setErr(false);
        setUser(doc.data());
      });
    } catch (err) {
      console.log("handleSearch issue:" + err);
    }
  };

  const handleKeyDown = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (u) => {
    //check whether the group(chats in firestore) exists, if not create new one
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //this is a firebase method
        //create user chats
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else dispatch({ type: "CHANGE_USER", payload: u });
    } catch (err) {
      console.log(err);
    }

    setUser(null);
    setUsername("");
  };
  return (
    <div className="search">
      <div className="searchForm">
        <AiOutlineSearch size={20} style={{ color: "white", margin: "10" }} />
        <input
          type="text"
          placeholder="Find a User"
          onKeyDown={handleKeyDown}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User Not Found!</span>}
      {user && (
        <div className="userChat" onClick={() => handleSelect(user)}>
          <img className="avatar" src={user.photoURL} alt="avatar" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default Search;
