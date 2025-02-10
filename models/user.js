"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cuisine, { foreignKey: "authorId" });
    }
  }
  User.init(
    {
      //optional
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      //validation, email format
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email sudah dipakai.",
        },
        validate: {
          notEmpty: { msg: "Email tidak boleh kosong." },
          notNull: { msg: "Email tidak boleh kosong." },
          isEmail: true,
        },
      },
      //validation, length min 5, need to hash
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password tidak boleh kosong." },
          notNull: { msg: "Password tidak boleh kosong." },
          len: {
            args: [5],
            msg: "Password harus berisi minimal 5 character.",
          },
        },
      },
      //default staff
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Staff",
      },
      //optional
      phoneNumber: DataTypes.STRING,
      //optional
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
    }
  );
  return User;
};
