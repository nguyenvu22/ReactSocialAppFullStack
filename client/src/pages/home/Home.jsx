import "./home.scss";
import Posts from "../../conponents/posts/Posts";
import Share from "../../conponents/share/Share";
import Stories from "../../conponents/stories/Stories";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Home = () => {
  return (
    <div className="home">
      <Stories />
      <div className="scrollButton">
        <ArrowBackIosNewIcon
          className="btn backward"
          onClick={() => {
            document.getElementById("stories").scrollLeft -= 250;
            document.getElementById("stories").style.scrollBehavior = "smooth";
          }}
        />
        <ArrowForwardIosIcon
          className="btn forward"
          onClick={() => {
            document.getElementById("stories").scrollLeft += 250;
            document.getElementById("stories").style.scrollBehavior = "smooth";
          }}
        />
      </div>
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
