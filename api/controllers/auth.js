import { db } from "../connect.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //Check user if exist
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exist !!");

    //If not -> create new user
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);

    const query =
      "INSERT INTO users(`username`, `email`, `password`, `name`) VALUE(?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Created 1 User.");
    });
  });
};

export const login = (req, res) => {
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User Not Found !!");

    const checkPassword = bcryptjs.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!!");

    //setup token passing to cookie
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0];

    //seen cookie
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none"
  }).status(200).json("User has been Logout.")
};
