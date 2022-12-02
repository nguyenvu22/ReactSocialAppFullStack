import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    const { password, ...others } = data[0];
    return res.status(200).json(others);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query =
      "UPDATE users SET `name`=?, `city`=?, `website`=?,`coverPic`=?, `profilePic`=? WHERE `id`=?";

    db.query(
      query,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!"); //make sure that only 1 row is updated
        return res.status(403).json("You can update only your post!!");
      }
    );
  });
};

export const getUnfollowUser = (req, res) => {
  const query =
    "SELECT * FROM users WHERE id NOT IN(SELECT r.followedUserId FROM users AS u JOIN relationships AS r ON (u.id = r.followerUserId AND r.followerUserId = ? ))";
  db.query(query, [req.query.followerId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(
      data.map((item) => {
        const { password, ...others } = item;
        return others;
      })
    );
  });
};
