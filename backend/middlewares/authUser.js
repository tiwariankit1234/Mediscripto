import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    // Accept either `Authorization: Bearer <token>` or a `token` header
    const authHeader = req.headers.authorization || req.headers.token || "";
    let token = null;
    if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    else if (authHeader) token = authHeader;

    // console.log("token from header", token);
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
    }

    if (!process.env.JWT_SECRET) {
      // console.error("JWT_SECRET is not set in environment");
      return res.status(500).json({ success: false, message: "Server misconfiguration" });
    }

    let token_decode;
    try {
      token_decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // console.warn("JWT verification failed:", err.message);
      return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }

    // attach trusted user id to request (do not mutate req.body)
    req.userId = token_decode.id;
    next();
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default authUser;
