exports.verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are no Authenticated"});
    } else {
        jwt.verify(token, "verysectretkey007", (err, decoded) => {
            if(err) return res.json({Error: "Token wrong"});
            req.role = decoded.role;
            req.userId = decoded.userId;
            req.divisionId = decoded.divisionId;
            next();
        } )
    }
}