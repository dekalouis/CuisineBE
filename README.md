[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18114352&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

# API Documentation

---

### ALL ENDPOINTS:

#### User

- `POST /add-user`
- `POST /login`

#### Cuisines

- `POST /cuisines`
- `GET /cuisines`
- `GET /cuisines/:id`
- `PUT /cuisines/:id`
- `DELETE /cuisines/:id`

#### Category

- `POST /categories`
- `GET /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

#### Public

- `GET /pub/cuisines`
- `GET /pub/cuisines/:id`

DB Password: Thisisaverystrongpassword!

<br>
<!--! ADDUSER -->

## User Auth Endpoints

---

## 1. POST /add-user

**Description:**
This endpoint allows **Admins** to register a new user.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

-Request Body:

```json
{
  "username": "string",
  "email": "string", //email format
  "password": "string", //5 char min
  "phoneNumber": "string",
  "address": "string"
}
```

### Response:

- 201 Created

```json
{
  "id": 1,
  "email": "user@example.com",
  "message": "Registrasi Sukses!"
}
```

- 400 Bad Request (Validation Error)

```json
{
  "message": "Email tidak boleh kosong"
}
OR
{
  "message": "Email sudah dipakai."
}
OR
{
  "message": "Password tidak boleh kosong."
}
OR
{
  "message": "Password harus berisi minimal 5 character."
}
etc

```

- 403 Forbidden (If not an Admin)

```json
{
  "message": "Forbidden Access!"
}
```

---

<!--! LOGIN -->

## 2. POST /login

**Description:**
This endpoint allows users to log in and receive a JWT token for authentication.

- Request Body:

```json
{
  "email": "string", // email format
  "password": "string"
}
```

### Response:

- 200 OK

```json
{
  "access_token": "jwt.token"
}
```

- 400 Bad Request (Missing Fields)

```json
{
  "message": "Email dibutuhkan"
}
OR
{
  "message": "Password dibutuhkan"
}
```

- 401 Unauthorized (Incorrect Credentials)

```json
{
  "message": "Email atau Password salah!"
}
```

<!-- ! BUAT CUISINENYA -->

## <br><br>

## Cuisines Endpoints

## 1. POST /cuisines

**Description:**
This endpoint allows **authenticated users** to create a new cuisine.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

- Request Body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number"
}
```

### Response:

- 201 Created

```json
{
  "data": {
    "id": 7,
    "name": "Nasi Uduk",
    "description": "Classic Indonesian nasi uduk with sambal and lalapan.",
    "price": 15000,
    "imgUrl": "https://placecats.com/300/200",
    "categoryId": 2,
    "authorId": 3,
    "updatedAt": "2025-02-12T06:29:21.167Z",
    "createdAt": "2025-02-12T06:29:21.167Z"
  },
  "message": "Cuisine successfully created."
}
```

- 400 Bad Request (Validation Error)

```json
{
  "message": "Nama makanan tidak boleh kosong"
}
OR
{
  "message": "Harga tidak boleh kosong"
}
OR
{
  "message": "Category harus dipilih"
}
etc
```

---

## 2. GET /cuisines

**Description:**
This endpoint allows users to retrieve a list of all cuisines.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

### Response:

- 200 OK

```json
[
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "string",
    "updatedAt": "string",
    "User": {
      "id": "authorId",
      "username": "string",
      "email": "string",
      "role": "string",
      "phoneNumber": "string",
      "address": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
]
```

---

## 3. GET /cuisines/:id

**Description:**
This endpoint allows users to retrieve details of a specific cuisine by its ID.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

### Response:

- 200 OK

```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "price": "integer",
  "imgUrl": "string",
  "categoryId": "integer",
  "authorId": "integer",
  "createdAt": "string",
  "updatedAt": "string",
  "User": {
    "id": "authorId",
    "username": "string",
    "email": "string",
    "role": "string",
    "phoneNumber": "string",
    "address": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

- 404 Not Found

```json
{
  "message": "Cuisine id:1 not found!"
}
```

---

## 4. PUT /cuisines/:id

**Description:**
This endpoint allows **authenticated users** to update an existing cuisine. **Staff can only update their own cuisines**.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

- Request Body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "imgUrl": "string",
  "categoryId": "number"
}
```

### Response:

- 200 OK

```json
{
  "message": "Cuisine id:1 updated."
}
```

- 400 Bad Request (Validation Error)

```json
{
  "message": "Nama cuisine diperlukan"
}
OR
{
  "message": "Harga diperlukan"
}
etc
```

- 403 Forbidden (If Staff tries to update another user's cuisine)

```json
{
  "message": "Forbidden Access! Kamu bukan Admin!"
}
```

---

## 5. DELETE /cuisines/:id

**Description:**
This endpoint allows **authenticated users** to delete an existing cuisine. **Staff can only delete their own cuisines**.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

### Response:

- 200 OK

```json
{
  "message": "Cuisine Nasi Uduk successfully deleted."
}
```

- 403 Forbidden (If Staff tries to delete another user's cuisine)

```json
{
  "message": "Forbidden Access! Kamu bukan Admin!"
}
```

<!-- ! BUAT KATEGORINYAAA -->

<br><br>

---

## Category Endpoints

## 1. POST /categories

**Description:**
This endpoint allows **Admins only** to create a new category.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

- Request Body:

```json
{
  "name": "string"
}
```

### Response:

- 201 Created

```json
{
  "data": {
    "id": 1,
    "name": "Category Name"
  },
  "message": "Category successfully created."
}
```

- 400 Bad Request (Validation Error)

```json
{
  "message": "Nama category diperlukan"
}
```

- 403 Forbidden (If not an Admin)

```json
{
  "message": "Forbidden Access!"
}
```

---

## 2. GET /categories

**Description:**
This endpoint allows users to retrieve a list of all categories.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

### Response:

- 200 OK

```json
[
  {
    "id": 1,
    "name": "string"
  },
  {
    "id": 2,
    "name": "string"
  }
]
```

---

## 3. PUT /categories/:id

**Description:**
This endpoint allows **Admins only** to update an existing category.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

- Request Body:

```json
{
  "name": "string"
}
```

### Response:

- 200 OK

```json
{
  "message": "Category updated successfully."
}
```

- 400 Bad Request (Validation Error)

```json
{
  "message": "Nama category diperlukan"
}
```

- 403 Forbidden (If not an Admin)

```json
{
  "message": "Forbidden Access!"
}
```

---

## 4. DELETE /categories/:id

**Description:**
This endpoint allows **Admins only** to delete an existing category.

- Headers:

```json
{
  "Authorization": "Bearer [access token]"
}
```

### Response:

- 200 OK

```json
{
  "message": "Category successfully deleted."
}
```

- 403 Forbidden (If not an Admin)

```json
{
  "message": "Forbidden Access!"
}
```

<!-- ! BUAT YANG PUBLIk -->

<br><br>

---

## Public Endpoints

## 1. GET /pub/cuisines

**Description:**
This public endpoint allows anyone to retrieve a list of all cuisines without authentication.

### Response:

- 200 OK

```json
[
  {
    "id": 1,
    "name": "string",
    "description": "string",
    "price": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

---

## 2. GET /pub/cuisines/:id

**Description:**
This public endpoint allows anyone to retrieve details of a specific cuisine by its ID without authentication.

### Response:

- 200 OK

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "price": "integer",
  "imgUrl": "string",
  "categoryId": "integer",
  "authorId": "integer",
  "createdAt": "string",
  "updatedAt": "string"
}
```

- 404 Not Found

```json
{
  "message": "Cuisine id:1 not found!"
}
```
