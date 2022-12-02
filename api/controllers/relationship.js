import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const query =
    "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(query, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query =
      "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";

    db.query(query, [[userInfo.id, req.body.userId]], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Following this person");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(query, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Unfollow");
    });
  });
};
