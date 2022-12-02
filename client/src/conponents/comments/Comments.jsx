import "./comments.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import PacmanLoader from "react-spinners/PacmanLoader";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
  });

  //------------------------------------
  //There are 2 way to send post ID :
  //  1. through query    : "/comments?postId="                 -> req.query.postID
  //  2. through req.body : mutation.mutate({ desc, postId });  -> req.body.postId,
  //------------------------------------
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="Write a Comment..."
          onChange={(e) => {
            setDesc(e.target.value);
          }}
          value={desc}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? (
        <PacmanLoader
          color="#36d7b7"
          size={20}
          cssOverride={{ marginLeft: "5px", marginBottom: "20px" }}
        />
      ) : isLoading ? (
        <PacmanLoader
          color="#36d7b7"
          size={20}
          cssOverride={{ marginLeft: "5px", marginBottom: "20px" }}
        />
      ) : (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <div className="infoText">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <div className="infoMore">
                <span>Like</span>
                <span>Reply</span>
                <span className="date">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
