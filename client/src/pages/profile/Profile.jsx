import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Posts from "../../conponents/posts/Posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import BarLoader from "react-spinners/BarLoader";
import Update from "../../conponents/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);

  const { currentUser, imgTransform } = useContext(AuthContext);

  const userId = useLocation().pathname.split("/")[2];
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data;
      }),
  });

  //Take who (following) follow this person (followed)
  const { isLoading: relationshipIsLoading, data: relationshipData } = useQuery(
    {
      queryKey: ["relationship"],
      queryFn: () =>
        makeRequest
          .get("/relationships?followedUserId=" + userId)
          .then((res) => {
            return res.data;
          }),
    }
  );

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
      queryClient.invalidateQueries({
        queryKey: ["followUser"],
      });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id)); //true: following
  };

  return (
    <>
      {isLoading ? (
        <BarLoader
          color="#36d7b7"
          cssOverride={{ margin: "auto", marginTop: "35%" }}
        />
      ) : (
        <div className="profile">
          <div className="images">
            <img src={imgTransform(data.coverPic)} alt="" className="cover" />
            <img src={imgTransform(data.profilePic)} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>English, Japanese</span>
                  </div>
                </div>
                {data.id === currentUser.id ? (
                  <button
                    className="btnUpdate"
                    onClick={() => {
                      setOpenUpdate(true);
                    }}
                  >
                    update
                  </button>
                ) : relationshipData?.includes(currentUser.id) ? (
                  <button
                    onClick={handleFollow}
                    className="btnFollowing"
                    id="btnFollowing"
                    onMouseOver={() => {
                      document.getElementById("btnFollowing").innerHTML =
                        "Unfollow";
                    }}
                    onMouseLeave={() => {
                      document.getElementById("btnFollowing").innerHTML =
                        "Following";
                    }}
                  >
                    Following
                  </button>
                ) : (
                  <button onClick={handleFollow} className="btnFollow">
                    Follow
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertOutlinedIcon />
              </div>
            </div>
          </div>
          <Posts userId={userId} />
        </div>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </>
  );
};

export default Profile;
