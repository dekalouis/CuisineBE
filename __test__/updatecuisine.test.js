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
const { sequelize, User, Cuisine } = require("../models");
const { signToken } = require("../helpers/jwt");
const { queryInterface } = sequelize;

let adminToken;
let staffToken;
let cuisineSample;

beforeAll(async () => {
  //users
  const users = require("../data/users.json").map((user) => {
    delete user.id;
    user.password = hashPassword(user.password);
    return {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  //cuisines
  const cuisines = require("../data/cuisines.json").map((cuisine) => {
    delete cuisine.id;
    return {
      ...cuisine,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  try {
    await queryInterface.bulkInsert("Users", users, {});
    await queryInterface.bulkInsert("Cuisines", cuisines, {});

    const admin = await User.findOne({ where: { email: "test@test.com" } });
    const staff = await User.findOne({ where: { email: "userbaru@test.com" } });

    cuisineSample = await Cuisine.findOne({
      //yang dibuat staff..
      where: { id: 2 },
    });

    console.log(cuisineSample, `INI CONTOH CUISINE`);
    console.log(staff, `INI CONTOH STAFF`);

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

  await queryInterface.bulkDelete("Cuisines", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

//testingnya
describe("PUT /cuisines/:id testing", () => {
  //todo sukses

  test("PUT /cuisines successful", async () => {
    const response = await request(app)
      .put(`/cuisines/${cuisineSample.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "food update",
        description: "test description",
        price: 10000,
        imgUrl:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        categoryId: 1,
      });

    console.log("STATUSNYA:", response.status);
    console.log("BODYNYA:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      `Cuisine id:${cuisineSample.id} updated.`
    );
  });

  // //todo failed not yet login

  test("/PUT /cuisines failed not yet login", async () => {
    const response = await request(app)
      .put(`/cuisines/${cuisineSample.id}`)
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

  // //todo gagal karena invalid token

  test("PUT /cuisines failed invalid token", async () => {
    const response = await request(app)
      .put(`/cuisines/${cuisineSample.id}`)
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

  // //todo gagal karena id not found

  test("PUT /cuisines failed id not found", async () => {
    const response = await request(app)
      .put(`/cuisines/999`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "test food",
        description: "test description",
        price: 10000,
        imgUrl:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        categoryId: 1,
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Cuisine id:999 not found!"
    );
  });

  // //todo staff no access coba edit

  test("PUT /cuisines failed staff no access", async () => {
    const response = await request(app)
      .put(`/cuisines/${cuisineSample.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        name: "test food",
        description: "test description",
        price: 10000,
        imgUrl:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        categoryId: 1,
      });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "message",
      "Forbidden Access! Kamu bukan Admin!"
    );
  });

  //7.PUT cuisine

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
