const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize } = require("../models");
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

//testingnya
describe("POST /login (Admin)", () => {
  //todo sukses
  test("POST /login successful", async () => {
    const response = await request(app).post("/login").send({
      email: "test@test.com",
      password: "testing",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    console.log(response.status, "<=== statusnya bos");
    console.log(response.body, "<=== bodynya yang kyk di postman");
  });

  //todo no email
  test("POST /login no email", async () => {
    const response = await request(app).post("/login").send({
      password: "testing",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email dibutuhkan");
  });

  //todo no password
  test("POST /login no password", async () => {
    const response = await request(app).post("/login").send({
      email: "test@test.com",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password dibutuhkan");
  });

  //todo email invalid
  test("POST /login wrong email", async () => {
    const response = await request(app).post("/login").send({
      email: "wrong@email.com",
      password: "testing",
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email atau Password salah!"
    );
  });

  //todo password salah
  test("POST /login wrong password", async () => {
    const response = await request(app).post("/login").send({
      email: "test@test.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email atau Password salah!"
    );
  });
});
