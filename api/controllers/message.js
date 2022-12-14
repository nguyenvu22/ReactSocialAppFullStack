import { db } from "../connect.js";
import moment from "moment";

export const addMessage = (req, res) => {
  const query =
    "INSERT INTO messages (`conversationId`, `sender`, `text`, `createdAt`) VALUES (?)";
  const values = [
    req.body.conversationId,
    req.body.sender,
    req.body.text,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  ];
  db.query(query, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Create conversation");
  });
};

export const getMessages = (req, res) => {
  const query = `SELECT m.* FROM messages AS m JOIN conversations AS c ON (m.conversationId = c.id) WHERE c.senderId = ? AND c.receiverId = ?
  ORDER BY m.createdAt ASC`;
  db.query(query, [req.query.senderId, req.query.receiverId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
