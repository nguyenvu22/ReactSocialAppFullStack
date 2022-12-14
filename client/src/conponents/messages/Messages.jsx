import "./messages.scss";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import VideocamIcon from "@mui/icons-material/Videocam";
import InfoIcon from "@mui/icons-material/Info";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InputEmoji from "react-input-emoji";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import MoonLoader from "react-spinners/MoonLoader";
import { useRef } from "react";
import { io } from "socket.io-client";

const Messages = ({ followedUser, onlineUser }) => {
  const [openTime, setOpenTime] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { currentUser, imgTransform } = useContext(AuthContext);
  const scrollRef = useRef();
  const socket = useRef(); //alter useState socket , setSocket

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () =>
      makeRequest
        .get(
          "/message/get?senderId=" +
            currentUser.id +
            "&receiverId=" +
            (followedUser?.id || 0)
        )
        .then((res) => {
          return res.data;
        }),
  });

  //Reverse
  const {
    isLoading: reversalIdLoading,
    error: reversalError,
    data: reversalData,
  } = useQuery({
    queryKey: ["messagesReversal"],
    queryFn: async () =>
      makeRequest
        .get(
          "/message/get?senderId=" +
            (followedUser?.id || 0) +
            "&receiverId=" +
            currentUser.id
        )
        .then((res) => {
          return res.data;
        }),
  });

  const renderData = data?.length !== 0 ? data : reversalData;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (message) => {
      return makeRequest.post("/message", message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messagesReversal"] });
    },
  });

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  }, []);

  useEffect(() => {
    //Send event (user id)
    socket.current.emit("currentUserId", currentUser.id);

    //Take all users connect to socket (be)
    socket.current.on("onlineUsers", (socketUsers) => {
      console.log(socketUsers);
    });
  }, [currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, reversalData]);

  const handleEnter = () => {
    mutation.mutate({
      conversationId: renderData.map((item) => item.conversationId)[0],
      sender: currentUser.id,
      text: newMessage,
    });
    socket.current.emit("sendMessage", {
      receiverId: followedUser.id,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="messages">
      <div className="messagesContainer">
        <div className="left">
          <div className="info">
            <div className="avatar">
              <img
                src={
                  followedUser?.profilePic ||
                  "https://icons.veryicon.com/png/o/miscellaneous/youyinzhibo/guest.png"
                }
                alt=""
              />
              {onlineUser.filter((online) => online.userId === followedUser.id)
                .length !== 0 && <span></span>}
              {/* <span></span> */}
            </div>
            <p>{followedUser?.name || "Guest"}</p>
            <div className="more">
              <LocalPhoneIcon className="icon" />
              <VideocamIcon className="icon" />
              <InfoIcon className="icon" />
            </div>
          </div>
          <div className="message">
            {isLoading || reversalIdLoading ? (
              <MoonLoader color="#0084ff" cssOverride={{ margin: "auto" }} />
            ) : renderData.length !== 0 ? (
              renderData.map((item) => {
                let classify =
                  item.sender === currentUser.id ? "single me" : "single";
                return (
                  <div className={classify} key={item.id} ref={scrollRef}>
                    <img
                      src={
                        item.sender === currentUser.id
                          ? currentUser.profilePic
                          : followedUser.profilePic
                      }
                      alt=""
                    />
                    <div
                      className="bubbleChat"
                      onClick={() => {
                        setOpenTime(!openTime);
                      }}
                    >
                      <p>{item.text}</p>
                    </div>
                    {openTime && (
                      <p className="time">{moment(item.createdAt).fromNow()}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="none">Start Chatting</p>
            )}
          </div>
          <div className="text">
            <InputEmoji
              value={newMessage}
              onChange={setNewMessage}
              cleanOnEnter
              onEnter={handleEnter}
              placeholder=""
            />
            <SendRoundedIcon className="icon" onClick={handleEnter} />
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
};

export default Messages;
