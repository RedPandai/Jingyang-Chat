import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";


function Message({message}) {
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const ref = useRef();

  useEffect(()=>{
    ref.current?.scrollIntoView({behaviour: 'smooth'})
  }, [message])

  return (
    <div ref={ref} className= {`message ${message.senderId === currentUser.uid && 'owner'}`} >
      <div className="messageInfo">
        <img className='avatar' src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt='avatar'/>
        <span>just now</span>
      </div>
      <div className='messsageContent'>
        <p>{message.text}</p>
        {message.img && <img className='chatimg' src={message.img} alt='avatar'/>}
      </div>
    </div>
  );
}
export default Message;
