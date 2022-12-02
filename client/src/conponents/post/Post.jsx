import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareIcon from "@mui/icons-material/Share";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Comments from "../comments/Comments";
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  console.log(post);
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser, imgTransform } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  //Using 2 way to send param
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <Link
              to={`/profile/${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={post.profilePic} alt="" />
            </Link>
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>

              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizOutlinedIcon
            className="icon"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          />
          {menuOpen && post.userId === currentUser.id && (
            <div className="deldeteBtn">
              <button onClick={handleDelete}>Delete</button>
              <button>Edit</button>
              <button>Report</button>
            </div>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={imgTransform(post.img)} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {data?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                className="icon"
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div
            className="item"
            onClick={() => {
              setCommentOpen(!commentOpen);
            }}
          >
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
