import jwt from "jsonwebtoken";

export default function VerifyToken(req, res, next) {
  if (req.cookies.token == undefined)
    return res.status(401).json({ message: "UNAUTHORIZED ACCESS" });

  
    try {
         const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }

    catch (err) {
        res.status(401).json({ message: "UNAUTHORIZED ACCESS" });
    }
    
}
