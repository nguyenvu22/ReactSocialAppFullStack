import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);

  const { currentUser, imgTransform } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Social App</span>
        </Link>
        <HomeOutlinedIcon className="icon"/>

        {darkMode ? (
          <LightModeIcon onClick={toggle} className="icon"/>
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} className="icon"/>
        )}

        <GridViewOutlinedIcon className="icon"/>
        <div className="search">
          <SearchOutlinedIcon className="icon"/>
          <input type="text" placeholder="Search.." />
        </div>
      </div>
      <div className="right">
        <PersonOutlineOutlinedIcon className="icon"/>
        <EmailOutlinedIcon className="icon"/>
        <NotificationsNoneOutlinedIcon className="icon"/>
        <div className="user">
          <img
            src={imgTransform(currentUser.profilePic)}
            alt=""
          />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
