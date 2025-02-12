const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize, User } = require("../models");
const user = require("../models/user");
const { queryInterface } = sequelize;

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
    // console.log("contoh user: ", users[0], users[1]);
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

test("POST /login", async () => {
  const response = await request(app).post("/login").send({
    email: "test@test.com",
    password: "testing",
  });
  expect(response.status).toBe(200);
  console.log(response.status, "<=== statusnya bos");
  console.log(response.body, "<=== bodynya yang kyk di postman");
});
