import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import PacmanLoader from "react-spinners/PacmanLoader";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts?userId=" + userId).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="posts">
      {error ? (
        <PacmanLoader
          color="#36d7b7"
          size={50}
          cssOverride={{ margin: "auto", marginTop: "20%" }}
        />
      ) : isLoading ? (
        <PacmanLoader
          color="#36d7b7"
          size={50}
          cssOverride={{ margin: "auto", marginTop: "20%" }}
        />
      ) : (
        data.map((post) => (
          <div key={post.id}>
            <Post post={post}/>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
