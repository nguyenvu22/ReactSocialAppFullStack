import "./update.scss";
import ImageIcon from "@mui/icons-material/Image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { makeRequest } from "../../axios";

const Update = ({ setOpenUpdate, user }) => {
  const [inputs, setInputs] = useState({
    name: user?.name || "",
    city: user?.city || "",
    website: user?.website || "",
  });
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  console.log(user);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let coverUrl = user.coverPic;
    // let profileUrl = user.profilePic;
    let coverUrl, profileUrl;

    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...inputs, coverPic: coverUrl, profilePic: profileUrl });

    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <div className="container">
        <p>Changing your Profile</p>
        <form>
          <div className="item">
            <input
              id="cover"
              className="inputImg"
              type="file"
              onChange={(e) => {
                setCover(e.target.files[0]);
              }}
            />
            <label htmlFor="cover">
              <span>Background Picture</span>
              <ImageIcon />
            </label>
            {cover && <img src={URL.createObjectURL(cover)} alt="" />}
          </div>
          <div className="item">
            <input
              id="profile"
              className="inputImg"
              type="file"
              onChange={(e) => {
                setProfile(e.target.files[0]);
              }}
            />
            <label htmlFor="profile">
              <span>Avatar</span>
              <CameraAltIcon />
            </label>
            {profile && <img src={URL.createObjectURL(profile)} alt="" />}
          </div>
          <div className="item" style={{ width: "50%" }}>
            <span className="span">Name</span>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder={inputs.name}
            />
          </div>
          <div className="item" style={{ width: "50%" }}>
            <span className="span">City</span>
            <input
              type="text"
              name="city"
              onChange={handleChange}
              placeholder={inputs.city}
            />
          </div>
          <div className="item">
            <span className="span" style={{width: "10%"}}>Website</span>
            <input
              type="text"
              name="website"
              onChange={handleChange}
              placeholder={inputs.website}
              style={{width: "83%"}}
            />
          </div>
          <button onClick={handleSubmit}>Update</button>
        </form>
        <button
          className="closeBtn"
          onClick={() => {
            setOpenUpdate(false);
          }}
        >
          &#10005;
        </button>
      </div>
    </div>
  );
};

export default Update;
