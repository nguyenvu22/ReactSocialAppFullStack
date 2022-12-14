import "./stories.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClockLoader from "react-spinners/ClockLoader";
import Story from "../story/Story";

const Stories = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openStory, setOpenStory] = useState(false);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [userId, setUserId] = useState();

  const { currentUser, imgTransform } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest.get("/stories").then((res) => {
        return res.data;
      }),
  });

  // console.log(data);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handlePost = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });

    setDesc("");
    setFile(null);
    setOpenAdd(false);
  };

  return (
    <>
      <img src="../../assets/reaction/care-48x48-1991058.png" alt="" />
      <img src="../../assets/10.png" alt="" />
      <div className="stories" id="stories">
        <div
          className="story main"
          onClick={() => {
            setOpenAdd(!openAdd);
          }}
        >
          <img src={currentUser.profilePic} alt="" />
          <span>{currentUser.name}</span>
          <button></button>
          <span className="addStory">Add Story</span>
        </div>
        {isLoading || error ? (
          <ClockLoader
            color="#36d7b7"
            size={100}
            cssOverride={{
              marginTop: "8%",
            }}
          />
        ) : (
          data.map((story) => (
            <div
              className="story"
              key={story.id}
              onClick={() => {
                setUserId(story.userId);
                setOpenStory(!openStory);
              }}
            >
              <img src={imgTransform(story.img)} alt="" />
              <span>{currentUser.id === story.userId ? "me" : story.name}</span>
            </div>
          ))
        )}

        {openAdd && (
          <div className="story_adder">
            <div className="sContainer">
              <div className="left">
                <label htmlFor="file">
                  <ControlPointIcon className="icon" />
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </label>
                <label htmlFor="text">
                  <FormatColorTextIcon className="icon" />
                </label>
                <div className="btn">
                  <button className="post" onClick={handlePost}>
                    Post
                  </button>
                  <button
                    className="close"
                    onClick={() => {
                      setOpenAdd(!openAdd);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="right">
                {/* <img className="file" alt="" src={URL.createObjectURL("")} /> */}
                <img
                  className={file ? "img active" : "img"}
                  alt=""
                  src={file ? URL.createObjectURL(file) : ""}
                />
                <input
                  id="text"
                  type="text"
                  className="input"
                  placeholder="what to share more?"
                  value={desc}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {openStory && <Story userId={userId} setOpenStory={setOpenStory} />}
    </>
  );
};

export default Stories;
