const request = require("supertest");
const app = require("../app");
const { sequelize, User, Cuisine } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

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

describe("GET /pub/cuisines", () => {
  test("GET semua cuisine tanpa filter", async () => {
    const response = await request(app).get("/pub/cuisines");

    // console.log(response.body, "INI LOH BODYNYAAAAAAAAAAAA");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(10);
  });

  test("GET cuisine dengan 1 filter parameter", async () => {
    const response = await request(app)
      .get("/pub/cuisines")
      .query({ filter: { categories: "3" } });

    // console.log(response.body, "INI LOH BODYNYAAAAAAAAAAAA");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);
  });

  test("GET cuisine dengan result pagination", async () => {
    const response = await request(app)
      .get("/pub/cuisines")
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });
});
//10.endpoint public site

//todo sukses without query filter parameter
//todo sukses with 1 query filter parameter
//todo sukses serta panjang paginationnya

//11.endpoint public site

//todo sukses 1 cuisine dengan id param
//todo gagal karena invalid id
