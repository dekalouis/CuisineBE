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
let cuisineSampleTwo;

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
  //deletes
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
      where: { id: 5 },
    });
    cuisineSampleTwo = await Cuisine.findOne({
      //yang dibuat admin.
      where: { id: 1 },
    });

    // console.log(cuisineSample, `INI CONTOH CUISINE`);
    // console.log(staff, `INI CONTOH STAFF`);

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
describe("delete /cuisines/:id testing", () => {
  //todo sukses delete

  test("delete /cuisines successful", async () => {
    const response = await request(app)
      .delete(`/cuisines/${cuisineSample.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log(response.body, `BODY BUAT YANG HARUSNYA SUKSES`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      `Cuisine ${cuisineSample.name} successfully deleted`
    );
  });

  //todo failed not yet login

  test("/delete /cuisines failed not yet login", async () => {
    const response = await request(app).delete(`/cuisines/${cuisineSample.id}`);

    console.log(response.body, `BODY BUAT YANG BELUM LOGIN`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  //

  //todo gagal karena invalid token

  test("delete /cuisines failed invalid token", async () => {
    const response = await request(app)
      .delete(`/cuisines/${cuisineSample.id}`)
      .set("Authorization", `Bearer token-boongan`);

    console.log(response.body, `BODY BUAT YANG TOKENNYA INVALID`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  //todo gagal karena id not found

  test("delete /cuisines failed id not found", async () => {
    const response = await request(app)
      .delete(`/cuisines/999`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Cuisine id:999 not found!"
    );
  });

  //todo staff no access coba edit

  test("delete /cuisines failed staff no access", async () => {
    const response = await request(app)
      .delete(`/cuisines/${cuisineSampleTwo.id}`)
      .set("Authorization", `Bearer ${staffToken}`);
    // console.log("THIS IS THE CUISINE SAMPLEEEEEEEE:", cuisineSampleTwo);
    // console.log("STATUSNYA:", response.status);
    // console.log("BODYNYA:", response.body);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "message",
      "Forbidden Access! Kamu bukan Admin!"
    );
  });
});
