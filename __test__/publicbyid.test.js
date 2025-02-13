const request = require("supertest");
const app = require("../app");
const { sequelize, Cuisine } = require("../models");
const { queryInterface } = sequelize;

let existingCuisineId;
beforeAll(async () => {
  const testUser = await queryInterface.bulkInsert(
    "Users",
    [
      {
        username: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        role: "Admin",
        phoneNumber: "123456789",
        address: "Test Address",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { returning: true }
  );

  const testUserId = testUser[0].id;

  const cuisine = await Cuisine.create({
    name: "Test Cuisine",
    description: "A test dish",
    price: 25000,
    imgUrl: "https://placecats.com/300/200",
    categoryId: 1,
    authorId: testUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  existingCuisineId = cuisine.id;
});

afterAll(async () => {
  await queryInterface.bulkDelete("Cuisines", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("GET /pub/cuisines/:id", () => {
  test("GET 1 cuisine dengan id yang sesuai.", async () => {
    const response = await request(app).get(
      `/pub/cuisines/${existingCuisineId}`
    );
    console.log(response.body, `ini response!!!!!!!!`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", existingCuisineId);
    expect(response.body).toHaveProperty("name", "Test Cuisine");
  });

  test("Gagal get 1 cuisine by ID karena ID tidak ada", async () => {
    const response = await request(app).get("/pub/cuisines/999999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Cuisine id:999999 not found!"
    );
  });
});
