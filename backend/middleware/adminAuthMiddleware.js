import jwt from "jsonwebtoken";
import User from "../model/user.js";

const protectAdmin = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const admin = await User.findById(decoded.id).select("-password");
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }

            req.admin = admin;
            next();
        } catch (error) {
            console.error("JWT Verification Error (Admin):", error);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        res.status(403).json({ message: "Access denied, token missing" });
    }
};
const admin = async (req, res, next) => {
    if (req.admin && req.admin.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin privileges required" });
    }
};

export { protectAdmin, admin };
