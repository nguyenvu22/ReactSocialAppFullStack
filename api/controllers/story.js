import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query = `SELECT s.*, u.name, u.profilePic FROM stories AS s 
    JOIN users AS u ON u.id = s.userId
    LEFT JOIN relationships AS r ON (r.followedUserId = s.userId) WHERE r.followerUserId = ? OR s.userId = ?
    GROUP by s.userId`;

    db.query(query, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};

export const getSpecificStory = (req, res) => {
  const query = `SELECT s.*, u.profilePic, u.name FROM stories AS s JOIN users AS u ON u.id = s.userId
    WHERE s.userId = ? ORDER BY s.createdAt DESC`;
    
    // db.query(query, [req.body.id], (err, data) => {
    db.query(query, [req.query.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query =
      "INSERT INTO stories (`img`, `userId`, `createdAt`, `desc`) VALUES (?)";

    const values = [
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.desc,
    ];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Story has been created.");
    });
  });
};
