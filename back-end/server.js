const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "123456789";
const EXPIRATION_TIME = "1h";

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", { email, password });

  const user = router.db.get("users").find({ email }).value();
  console.log("User from DB:", user);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: EXPIRATION_TIME,
    });
    res.json({ token, user: { id: user.id, email: user.email } });
  } else {
    res.status(401).json({ message: "Incorrect email or password" });
  }
});

server.use((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.userId;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
