import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "freeuser",
  password: "",
  database: "social_app",
});

db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + db.threadId);
});
