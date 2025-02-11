const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/");

const authentication = async (req, res, next) => {
  try {
    //otentikasi user dulu, hanya admin yang bisa bikin akun
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      next({ name: "Unauthorized", message: "Invalid token" });
      //   res.status(401).json({ message: "Invalid token" });
      return;
    }
    // console.log(bearerToken);
    const token = bearerToken.split(" ")[1];
    // console.log(token);
    //! verifikasi tokennya
    const data = verifyToken(token);
    // console.log(data);

    const user = await User.findByPk(data.id);
    if (!user) {
      next({ name: "Unauthorized", message: "Invalid token" });
      //   res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    // console.log(err);
    next(err);
    // else {
    //       res.status(500).json({ message: `Internal Server Error.` });
    //     }
  }
};

module.exports = authentication;
