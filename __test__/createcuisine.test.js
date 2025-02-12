/* contoh user:  {
      username: 'test',
      email: 'test@test.com',
      password: '$2b$10$tRrzL4lVAmSWvUn0KXIpqeP8otp3WIlizycIEnnAX3/nscxS1kDX2',
      role: 'Admin',
      phoneNumber: '9679328724',
      address: 'Jalan Pulang',
      createdAt: 2025-02-12T12:47:38.463Z,
      updatedAt: 2025-02-12T12:47:38.463Z
    } {
      username: 'userbaru',
      email: 'userbaru@test.com',
      password: '$2b$10$4r9B9FYDPDGvSa/lWi8QseN4djhwh0xb9KoqNMFq6GRwtTsmydfNa',
      role: 'Staff',
      phoneNumber: '08111888888',
      address: 'Jalan Pergi',
      createdAt: 2025-02-12T12:47:38.518Z,
      updatedAt: 2025-02-12T12:47:38.518Z
    }
      */

const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize, User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { queryInterface } = sequelize;

let adminToken;
let staffToken;

beforeAll(async () => {
  const users = require("../data/users.json").map((user) => {
    delete user.id;
    user.password = hashPassword(user.password);
    return {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  try {
    await queryInterface.bulkInsert("Users", users, {});
    // const admin = users[0];
    // const staff = users[1];

    const admin = await User.findOne({ where: { email: "test@test.com" } });
    const staff = await User.findOne({ where: { email: "userbaru@test.com" } });

    adminToken = signToken({ id: admin.id });
    staffToken = signToken({ id: staff.id });

    // console.log(adminToken, admin);
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

//testingnya
describe("POST /cuisines testing", () => {
  //todo sukses
  test("POST /cuisines successful", async () => {
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "test food",
        description: "test description",
        price: 10000,
        imgUrl:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        categoryId: 1,
      });

    // console.log("STATUSNYA:", response.status);
    // console.log("BODYNYA:", response.body.data);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("name", "test food");
  });

  // //todo failed not yet login

  test("POST /cuisines failed not yet login", async () => {
    const response = await request(app).post("/cuisines").send({
      name: "test food",
      description: "test description",
      price: 10000,
      imgUrl:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      categoryId: 1,
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  // //todo gagal karena invalid token

  test("POST /cuisines failed invalid token", async () => {
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer token-boongan`)
      .send({
        name: "test food",
        description: "test description",
        price: 10000,
        imgUrl:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        categoryId: 1,
      });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  // //todo gagal karena req.body tidak sesuai (validation)
  test("POST /cuisines failed req.body invalid", async () => {
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "",
        description: "test description",
        imgUrl:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        categoryId: 1,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  //6.Update PUT cuisine

  //todo sukses
  //todo failed not yet login
  //todo gagal karena invalid token
  //todo gagal karena id not found
  //todo staff no access coba edit
  //todo gagal karena req.body tidak sesuai (validation)

  //7.Delete cuisine

  //todo sukses
  //todo failed not yet login
  //todo gagal karena invalid token
  //todo gagal karena id not found
  //todo staff no access coba edit

  //10.endpoint public site

  //todo sukses without query filter parameter
  //todo sukses with 1 query filter parameter
  //todo sukses serta panjang paginationnya

  //11.endpoint public site

  //todo sukses 1 cuisine dengan id param
  //todo gagal karena invalid id
});
