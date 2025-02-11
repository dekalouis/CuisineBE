const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async addUser(req, res, next) {
    try {
      //   res.json(`daftar`);

      const user = await User.create(req.body);

      res.status(201).json({
        id: user.id,
        email: user.email,
        message: "Registrasi Sukses!",
      });
    } catch (err) {
      next(err);
      //   console.log(err);
      //   if (err.name === "SequelizeValidationError") {
      //     res.status(400).json({ message: err.errors[0].message });
      //   } else if (err.name === "SequelizeUniqueConstraintError") {
      //     res.status(400).json({ message: err.errors[0].message });
      //   } else {
      //     res.status(500).json({ message: `Internal Server Error.` });
      //   }
    }
  }

  static async login(req, res, next) {
    try {
      //   res.json(`login`);

      const { email, password } = req.body;
      if (!email) {
        throw { name: "Email dibutuhkan" };
      }
      if (!password) {
        throw { name: "Password dibutuhkan" };
      }

      //cari
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        throw { name: "InvalidPass/Email" };
      }

      const isValidPass = comparePassword(password, user.password);
      if (!isValidPass) {
        throw { name: "InvalidPass/Email" };
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
