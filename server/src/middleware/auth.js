import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signStaffToken() {
  return jwt.sign({ role: "staff" }, JWT_SECRET, { expiresIn: "8h" });
}

export function requireStaff(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Sign in as staff to continue." });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "staff") throw new Error("wrong role");
    req.staff = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Your session has expired. Sign in again." });
  }
}
