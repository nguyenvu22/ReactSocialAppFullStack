import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const createConversation = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in yet!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const query =
      "SELECT * FROM conversations WHERE senderId = ? AND receiverId = ?";

    db.query(query, [userInfo.id, req.body.receiverId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(200).json(data);

      const query =
        "INSERT INTO conversations (`senderId`, `receiverId`) VALUES (?)";
      const values = [userInfo.id, req.body.receiverId];
      db.query(query, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Create conversation");
      });
    });
  });
};

export const userConversations = async (req, res) => {
  const query = "SELECT m.* FROM messages AS m JOIN conversations AS c ON (m.conversationId = c.id) WHERE c.senderId = 3 AND c.receiverId = 4";
  db.query(query, [req.params.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const findConversation = async (req, res) => {};
