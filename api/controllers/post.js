import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    //GET DUPLICATE RESULT
    //SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p
    // JOIN users AS u ON (u.id = p.userId)
    // LEFT JOIN relationships AS r ON (r.followedUserId = p.userId AND r.followerUserId = 3 OR p.userId = 3) ORDER BY p.createdAt ;

    const query =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p
    JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?
    ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
        ORDER BY p.createdAt DESC`;

    //r.followerUserId = ? OR p.userId = ? : hiện bài của user
    //r.followedUserId = p.userId : hiện bài post của người mà user đã follow

    const values =
      userId !== "undefined" ? [userInfo.id] : [userInfo.id, userInfo.id];

    db.query(query, values, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query =
      "INSERT INTO posts (`desc`, `img`, `userId`, `createdAt`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Post has been created");
    });
  });
};
export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query = "DELETE FROM posts WHERE `id`=? AND `userId`=?";

    db.query(query, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted");
      return res.status(403).json("You can delete only one Post");
    });
  });
};
