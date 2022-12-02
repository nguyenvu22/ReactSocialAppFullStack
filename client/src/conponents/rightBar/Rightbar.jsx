import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./rightBar.scss";

const Rightbar = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["followUser", currentUser.id],
    queryFn: () =>
      makeRequest
        .get("/users/findFollowUser?followerId=" + currentUser.id)
        .then((res) => {
          return res.data;
        }),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (followId) => {
      return makeRequest.post("/relationships", { userId: followId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
      queryClient.invalidateQueries({
        queryKey: ["followUser"],
      });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleFollow = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions for you</span>
          {data?.map((item) =>
            item.id !== currentUser.id ? (
              <div className="user" key={item.id}>
                <div className="userInfo">
                  <img src={item.profilePic} alt="" />
                  <span>{item.name}</span>
                </div>
                <div className="buttons">
                  <button
                    className="button"
                    onClick={() => {
                      handleFollow(item.id);
                    }}
                  >
                    follow
                  </button>
                  <button className="button">dismiss</button>
                </div>
              </div>
            ) : (
              <div key={item.id}></div>
            )
          )}
        </div>

        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://assets1.ignimgs.com/2016/01/26/rocunnamedjpg-0d75f7_160w.jpg?width=1280"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://assets1.ignimgs.com/2016/01/26/rocunnamedjpg-0d75f7_160w.jpg?width=1280"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://assets1.ignimgs.com/2016/01/26/rocunnamedjpg-0d75f7_160w.jpg?width=1280"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://assets1.ignimgs.com/2016/01/26/rocunnamedjpg-0d75f7_160w.jpg?width=1280"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://assets1.ignimgs.com/2016/01/26/rocunnamedjpg-0d75f7_160w.jpg?width=1280"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://assets1.ignimgs.com/2016/01/26/rocunnamedjpg-0d75f7_160w.jpg?width=1280"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://assets1.ignimgs.com/2016/01/26/rocunnamedjpg-0d75f7_160w.jpg?width=1280"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
