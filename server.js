const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const jwt = require("jsonwebtoken");
app.get("/", (req, res) => {
  return res.json({ message: "Hello World 🇵🇹 🤘" });
});

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
    req.userId = decoded.id;
    req.userRole = decoded.role;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/login", (req, res) => {
  const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
  try {
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌" });
  } catch (error) {
    console.error(error);
  }
});

app.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
});

app.get("/protected", authorization, (req, res) => {
  return res.json({ user: { id: req.userId, role: req.userRole } });
});

const start = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Api up and running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
start(3333);
