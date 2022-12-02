import "./share.scss";
import Friends from "../../assets/2.png";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext);

  const upload = async () => {
    try {
      //Can only send the file through formData but bot directly
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = useQueryClient();
  //if successful -> immediately refresh the method with specification 'queryKey'
  //Another word : Adding + Fetching data at the same time
  const mutation = useMutation({
    //Take the new data to post from -> mutation.mutate
    mutationFn: (newPost) => {
      //Make a request
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      //If success -> Refresh the query
      //=> refresh and get all posts again with queryKey in useQuery at Posts.jsx
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });

    setDesc("")
    setFile(null)
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
            />
          </div>
          <div className="right">
            {/* Create fake url to show img only */}
            {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friends} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
