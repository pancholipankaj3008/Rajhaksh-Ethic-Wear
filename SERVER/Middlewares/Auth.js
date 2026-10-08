let jwt = require("jsonwebtoken");
const { accessCookieOptions } = require("../Config/cookieConfig");

function normalizeRole(role) {
    if (role === "user") return "customer";
    // Existing staff users keep administrative access while the active roles
    // are consolidated to admin/customer for the wholesale application.
    if (["product manager", "order manager", "inventory staff"].includes(role)) return "admin";
    return role;
}

function issueAccessToken(res, decoded) {
    const role = normalizeRole(decoded.role);
    const token = jwt.sign({ id: decoded.id, role }, process.env.ACCESS, { expiresIn: "30m" });
    res.cookie("accessToken", token, accessCookieOptions());
    return token;
}

function RefreshAccessToken(req, res) {
    try {
        const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH);
        issueAccessToken(res, decoded);
        return res.json({ success: true });
    } catch {
        return res.status(401).json({ success: false, message: "Please login again" });
    }
}

function Auth(...roles) {

    return (req, res, next) => {
        try {

            let token = req.cookies.accessToken;

            if (!token)
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User"
                });

            let decoded = jwt.verify(token, process.env.ACCESS);

            const role = normalizeRole(decoded.role);
            if (!roles.includes(role)) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized User"
                });
            }

            req.id = decoded.id;
            req.role = role;

            next();

        } catch (error) {

            if (error.name !== "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User"
                });
            }

            try {

                const refreshToken = req.cookies.refreshToken;

                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "Please login again"
                    });
                }

                let decoded = jwt.verify(refreshToken, process.env.REFRESH);

                const role = normalizeRole(decoded.role);
                if (!roles.includes(role)) {
                    return res.status(401).json({
                        success: false,
                        message: "Unauthorized User"
                    });
                }

                issueAccessToken(res, decoded);

                req.id = decoded.id;
                req.role = role;

                next();

            } catch (error2) {
                return res.status(401).json({
                    success: false,
                    message: "Please login again"
                });
            }
        }
    }
}

module.exports = { Auth, RefreshAccessToken, issueAccessToken, normalizeRole };
