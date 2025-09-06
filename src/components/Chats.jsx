import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Chats() {
  const [chats, setChats] = useState({}); // object, not array
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser?.uid) {
      setChats({});
      return;
    }

    const ref = doc(db, "userChats", currentUser.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        // if doc doesn't exist yet, use {}
        setChats(snap.exists() ? snap.data() ?? {} : {});
      },
      () => setChats({})
    );

    return unsub; // proper cleanup
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
    if (u) dispatch({ type: "CHANGE_USER", payload: u });
  };

  const entries = Object.entries(chats || {}).sort((a, b) => {
    const aDate = a[1]?.date?.toMillis ? a[1].date.toMillis() : a[1]?.date ?? 0;
    const bDate = b[1]?.date?.toMillis ? b[1].date.toMillis() : b[1]?.date ?? 0;
    return bDate - aDate;
  });

  return (
    <div className="chats">
      {entries.map(([id, val]) => {
        const uid = val?.userInfo?.uid;
        const focused = uid && data?.user?.uid && uid === data.user.uid;
        return (
          <div
            className={`userChat ${focused ? "userChatFocused" : ""}`}
            key={id}
            onClick={() => handleSelect(val?.userInfo)}
          >
            <img
              className="avatar"
              src={val?.userInfo?.photoURL || "/placeholder-avatar.png"}
              alt="avatar"
            />
            <div className="userChatInfo">
              <span>{val?.userInfo?.displayName || "Unknown user"}</span>
              <p>{val?.lastMessage?.text || ""}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Chats;
