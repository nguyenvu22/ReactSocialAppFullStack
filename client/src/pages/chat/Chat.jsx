import { useEffect, useState } from "react";
import ChatList from "../../conponents/chatList/ChatList";
import Messages from "../../conponents/messages/Messages";
import "./chat.scss";
import { useRef } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [followedUser, setFollowedUser] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [onlineUser, setOnlineUser] = useState([]);
  const [sentMessage, setSentMessage] = useState("");
  const [popup, setPopup] = useState(false);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("onlineUsers", (socketUsers) => {
      setOnlineUser(socketUsers);
    });
  }, []);

  // useEffect(() => {
  //   socket.current.on("sentMessage", (msg) => {
  //     // setSentMessage(msg);
  //     alert(msg)
  //   });
  // }, [socket]);

  console.log("sent: " + sentMessage)

  // useEffect(() => {
  //   setPopup(true);
  //   setTimeout(() => {
  //     setPopup(false);
  //   }, 3000);
  // }, [sentMessage]);

  return (
    <div className="chat">
      <ChatList
        onlineUser={onlineUser}
        setFollowedUser={setFollowedUser}
        setOpenChat={setOpenChat}
        openChat={openChat}
      />
      {openChat ? (
        <Messages followedUser={followedUser} onlineUser={onlineUser} />
      ) : (
        <div style={{ flex: "5" }}></div>
      )}

      {popup ? (
        <div className="popup" style={{ bottom: "8%", right: "2%" }}>
          <div className="container">
            <p className="name">
              nguuu <span>has seen you a messages</span>
            </p>
            <p className="text">{sentMessage}</p>
          </div>
        </div>
      ) : (
        <div className="popup" style={{ bottom: "8%", right: "-50%" }}>
          <div className="container">
            <p className="name">
              nguuu <span>has seen you a messages</span>
            </p>
            <p className="text">{sentMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
