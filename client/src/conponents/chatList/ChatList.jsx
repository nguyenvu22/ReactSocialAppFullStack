import "./chatlist.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import SquareLoader from "react-spinners/SquareLoader";

const ChatList = ({ setFollowedUser, setOpenChat, openChat, onlineUser }) => {
  const { currentUser, imgTransform } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["chatWithUser"],
    queryFn: () =>
      makeRequest
        .get("/users/getFollowedUser?currentUserId=" + currentUser.id)
        .then((res) => {
          return res.data;
        }),
  });

  return (
    <div className="chatlist">
      <div className="chatListContainer">
        <input type="text" placeholder="Search For friends ..." />
        <div className="friends">
          {isLoading ? (
            <SquareLoader color="#0084ff" />
          ) : (
            data.map((item) => (
              <div
                className="friend"
                key={item.id}
                onClick={() => {
                  setFollowedUser(item);
                  if (openChat) {
                    setOpenChat(false);
                    setTimeout(() => {
                      setOpenChat(true);
                    }, 500);
                  } else {
                    setOpenChat(!openChat);
                  }
                }}
              >
                <div className="img">
                  <img src={item.profilePic} alt="" />
                  {onlineUser.filter((online) => online.userId === item.id)
                    .length !== 0 && <span></span>}
                </div>
                <p>{item.name}</p>
              </div>
            ))
          )}
        </div>

        <p className="showmore">
          {data?.length > 5 ? <KeyboardArrowDownIcon /> : <></>}
        </p>
      </div>
    </div>
  );
};

export default ChatList;
