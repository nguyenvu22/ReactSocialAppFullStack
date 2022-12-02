import "./story.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Angry from "../../assets/reaction/angry-48x48-1991061.png";
import Care from "../../assets/reaction/care-48x48-1991058.png";
import Haha from "../../assets/reaction/haha-48x48-1991060.png";
import Like from "../../assets/reaction/like-48x48-1991059.png";
import Love from "../../assets/reaction/love-48x48-1991064.png";
import Sad from "../../assets/reaction/sad-48x48-1991063.png";
import Wow from "../../assets/reaction/wow-48x48-1991062.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import moment from "moment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const Story = ({ userId, setOpenStory }) => {
  const [pos, setPos] = useState(1);

  const { imgTransform } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["story"],
    queryFn: () =>
      makeRequest.get("/stories/story?userId=" + userId).then((res) => {
        // makeRequest.get("/stories/story", {id:userId}).then((res) => {
        return res.data;
      }),
  });

  console.log(data);

  let width = (100 / data?.length) * pos;

  const storyUp = () => {
    document.getElementById("story").scrollLeft += 600;
    if (pos < data.length) setPos(pos + 1);
    document.getElementById("active").style.width = width * 2;
  };

  const storyDown = () => {
    document.getElementById("story").scrollLeft -= 600;
    if (pos > 1) setPos(pos - 1);
    document.getElementById("active").style.width = width * pos;
  };

  return (
    <div className="story">
      <div className="quantity">
        <div
          id="active"
          className="active"
          style={{ width: width + "%" }}
        ></div>
      </div>

      <ArrowBackIosNewIcon
        className="sliceBtn backward"
        onClick={() => {
          storyDown();
        }}
      />
      <ArrowForwardIosIcon
        className="sliceBtn forward"
        onClick={() => {
          storyUp();
        }}
      />

      <div className="container" id="story">
        {isLoading ? (
          <ClimbingBoxLoader
            color="rgba(255, 255, 255, 1)"
            cssOverride={{
              zIndex: "999",
              position: "absolute",
              top: "45%",
              left: "40%",
            }}
          />
        ) : (
          data.map((item, i) => (
            <div className="item" key={i}>
              <div className="info">
                <div className="left">
                  <img
                    src="https://recenthighlights.com/wp-content/uploads/2022/10/Lookism-Chapter-419.jpg"
                    alt=""
                  />
                </div>
                <div className="right">
                  <div className="name">
                    {item.name}{" "}
                    <span className="duration">
                      {moment(item.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="play">
                  {true ? <PlayArrowIcon className="item" /> : <PauseIcon className="item" />}

                  {true ? <VolumeUpIcon className="item" /> : <VolumeOffIcon className="item" />}
                  <MoreHorizIcon className="item" />
                </div>
              </div>
              <div className="top">
                <img src={imgTransform(item.img)} alt="" />
              </div>
              <div className="bot">
                <input type="text" placeholder="Reply..." />
                <div className="reaction">
                  <img className="icon" src={Angry} alt="" />
                  <img className="icon" src={Care} alt="" />
                  <img className="icon" src={Haha} alt="" />
                  <img className="icon" src={Like} alt="" />
                  <img className="icon" src={Love} alt="" />
                  <img className="icon" src={Sad} alt="" />
                  <img className="icon" src={Wow} alt="" />
                </div>
              </div>
              <div className="desc">{item.desc}</div>
            </div>
          ))
        )}
      </div>
      <button
        className="button"
        onClick={() => {
          setOpenStory(false);
        }}
      >
        &#9747;
      </button>
    </div>
  );
};

export default Story;
