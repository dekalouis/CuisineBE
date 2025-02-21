const { Op } = require("sequelize");
const { Cuisine, User, Category } = require("../models");
const cloudinary = require("cloudinary").v2;
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

class CuisineController {
  static async updateImageUrl(req, res, next) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }

      //   console.log(req.file, "<<< INI FILENYA");
      const oneMB = 1024000;
      if (req.file.size > oneMB * 5) {
        next({ name: "BadRequest", message: "File terlalu besar!" });
        return;
      }

      const mediaType = req.file.mimetype;
      const mediaBase64 = req.file.buffer.toString("base64");
      //   console.log(mediaBase64);

      // data:[<media-type>][;base64],<data>
      const base64 = `data:${mediaType};base64,${mediaBase64}`;

      const result = await cloudinary.uploader.upload(base64, {
        public_id: req.file.originalname,
        folder: "deka-restaurant-phase2",
      });

      await cuisineById.update({ imgUrl: result.secure_url });
      res.json({ message: "Image berhasil diupdate!", result });
    } catch (err) {
      next(err);
    }
  }

  static async createCuisine(req, res, next) {
    try {
      const userId = req.user.id;

      const newCuisine = await Cuisine.create({
        ...req.body,
        authorId: userId,
      });
      //   console.log(newCuisine);

      res.status(201).json({
        data: newCuisine,
        message: `Cuisine ${req.body.name} has been created.`,
      });
    } catch (err) {
      //   console.log(err);
      //   if (err.name === "SequelizeValidationError") {
      //     res.status(400).json({ message: err.errors[0].message });
      //     return;
      //   }
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }

  static async getCuisine(req, res, next) {
    try {
      const cuisines = await Cuisine.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      //   console.log(cuisines);
      res.status(200).json(cuisines);
    } catch (err) {
      //   console.log(err);
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }

  static async getCuisineById(req, res, next) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id, {
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        // res.status(404).json({ message: `Cuisine id:${id} not found.` });
        // return;
      } else {
        res.status(200).json(cuisineById);
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateCuisineById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        // res.status(400).json({ message: "ID cuisine diperlukan" });
        next({ name: "BadRequest", message: "ID cuisine diperlukan" });
        return;
      }

      //validasi manual
      if (!req.body.name) {
        // res.status(400).json({ message: "Nama cuisine diperlukan" });
        next({ name: "BadRequest", message: "Nama cuisine diperlukan" });
        return;
      }
      if (!req.body.description) {
        // res.status(400).json({ message: "Description diperlukan" });
        next({ name: "BadRequest", message: "Description diperlukan" });
        return;
      }
      if (!req.body.price) {
        // res.status(400).json({ message: "Harga diperlukan" });
        next({ name: "BadRequest", message: "Harga diperlukan" });
        return;
      }
      if (!req.body.categoryId) {
        // res.status(400).json({ message: "Category diperlukan" });
        next({ name: "BadRequest", message: "Category diperlukan" });
        return;
      }

      //validasi selesai

      const cuisineById = await Cuisine.findByPk(id);

      if (!cuisineById) {
        // res.status(404).json({ message: `Cuisine id:${id} not found.` });
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }

      await cuisineById.update(req.body);
      //   console.log(cuisineById);
      //   res.status(200).json(cuisineById);
      res.json({ message: `Cuisine id:${cuisineById.id} updated.` });
    } catch (err) {
      //   console.log(err);
      //dikasih validasi lagi in case user iseng ngosongin wkwkwk
      //   if (err.name === "SequelizeValidationError") {
      //     res.status(400).json({ message: err.errors[0].message });
      //   } else {
      //     res.status(500).json({ message: `Internal Server Error.` });
      //   }
      next(err);
    }
  }

  static async deleteCuisineById(req, res, next) {
    try {
      const { id } = req.params;
      //   const userId = req.user.id;
      //   const userRole = req.user.role;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }

      await cuisineById.destroy();
      res
        .status(200)
        .json({ message: `Cuisine ${cuisineById.name} successfully deleted` });
    } catch (err) {
      next(err);
    }
  }

  static async getPublicCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  }

  static async getPublicCuisine(req, res, next) {
    try {
      console.log(req.query);
      const { filter, sort, page, q } = req.query;

      const paramQuerySQL = {
        where: {},
        limit: 10,
        offset: 0,
      };

      //pub/cuisines?filter[categories]=3
      //* FILTER
      if (filter && filter.categories) {
        paramQuerySQL.where.categoryId = filter.categories.split(",");
      }
      // console.log(paramQuerySQL.where.categoryId, `INI BOS`);

      ///pub/cuisines?sort[by]=createdAt&sort[order]=asc
      //*SORT
      if (sort) {
        const validOrders = ["asc", "desc"];
        if (!sort.by || sort.by !== "createdAt") {
          next({ name: "BadRequest", message: "Hanya bisa sort createdAt!" });
          return;
        }
        if (!sort.order || !validOrders.includes(sort.order.toLowerCase())) {
          next({
            name: "BadRequest",
            message: "Invalid order, hanya bisa asc atau desc.",
          });
        }
        paramQuerySQL.order = [[sort.by, sort.order]];
      }

      //*PAGINATION
      ///pub/cuisines?page[size]=5&page[number]=2
      if (page) {
        if (page.size) {
          paramQuerySQL.limit = page.size;
        }
        if (page.number) {
          paramQuerySQL.offset =
            page.number * paramQuerySQL.limit - paramQuerySQL.limit;
        }
      }

      // //* SEARCH
      //pub/cuisines?q=burger
      if (q) {
        paramQuerySQL.where = {
          name: {
            [Op.iLike]: `%${q}%`,
          },
        };
      }

      const cuisines = await Cuisine.findAll(paramQuerySQL);
      //   console.log(cuisines);
      res.status(200).json(cuisines);
    } catch (err) {
      //   console.log(err);
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }

  static async getPublicCuisineById(req, res, next) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }

      res.status(200).json(cuisineById);
    } catch (err) {
      //   console.log(err);
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }
}

module.exports = CuisineController;
