const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: "error",
                message: "token not found",
            });
        }

        token = token.slice(7);
        jwt.verify(token, JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: "error",
                    message: err.message,
                });
            }

            req.user = decoded;
            return next();
        });
    } catch {
        return res.status(401).json({
            success: "error",
            message: "unauthorized",
        });
    }
};
