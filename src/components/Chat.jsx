import { useContext } from "react";
import { AiOutlineVideoCamera, AiOutlineUserAdd } from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi";
import { ChatContext } from "../context/ChatContext";
import Input from "./Input";
import Messages from "./Messages";

function Chat() {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <AiOutlineVideoCamera size={30} />
          <AiOutlineUserAdd size={30} />
          <FiMoreHorizontal size={30} />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
}
export default Chat;
