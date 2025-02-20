"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cuisine.belongsTo(models.Category, { foreignKey: "categoryId" });
      Cuisine.belongsTo(models.User, { foreignKey: "authorId" });
    }
  }
  Cuisine.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama makanan tidak boleh kosong" },
          notNull: { msg: "Nama makanan tidak boleh kosong" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Deskripsi tidak boleh kosong" },
          notNull: { msg: "Deskripsi tidak boleh kosong" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Harga tidak boleh kosong" },
          notNull: { msg: "Harga tidak boleh kosong" },
          min: {
            args: [5000],
            msg: "Harga minimal 5000 Rupiah.",
          },
        },
      },
      imgUrl: DataTypes.STRING,
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Category harus dipilih" },
          notNull: { msg: "Category harus dipilih" },
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Author harus dipilih" },
          notNull: { msg: "Author harus dipilih" },
        },
      },
    },
    {
      sequelize,
      modelName: "Cuisine",
      hooks: {
        beforeCreate: (instance) => {
          if (!instance.imgUrl.startsWith("http")) {
            instance.imgUrl =
              "https://media.istockphoto.com/id/184276935/id/foto/piring-kosong-di-atas-putih.jpg?s=612x612&w=0&k=20&c=4kGZNaanO2bml02k99C2N00Fw4fjXiN176Xm5_GxbR8=";
          }
        },
      },
    }
  );
  return Cuisine;
};
