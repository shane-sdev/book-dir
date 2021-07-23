const next = require("next");
const uuid = require("uuid");
const express = require("express");
const router = express.Router();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const firebaseAdmin = require("firebase-admin");

//preparing the connection
app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  //firebase inititalization
  const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });

  //endpoint for list of users
  server.get("/user/:name", async (req, res) => {
    const { name } = req.params;

    const db = admin.firestore();

    const allUsers = await db.collection("profile").get();

    const data = [];

    allUsers.forEach((item) => {
      if (item.exists) {
        const result = item.data();

        if (result.name === name) {
          data.push({
            ...result,
          });
        }
      }
    });

    let obj = {};

    if (data.length > 0) {
      obj = {
        ...data[0],
      };
    }

    res.status(200).json(obj);
  });

  //endpoint for list of all books
  server.get("/books", async (req, res) => {
    const db = admin.firestore();

    const allBooksCollection = await db.collection("books").get();

    const data = [];

    allBooksCollection.forEach((item) => {
      if (item.exists) {
        data.push({
          ...item.data(),
        });
      }
    });

    res.status(200).json(data);
  });

  //endpoint for specific book
  server.get("/book/isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;

    const db = admin.firestore();
    const allBooksCollection = await db.collection("books").get();

    const data = [];

    allBooksCollection.forEach((item) => {
      if (item.exists) {
        const result = item.data();

        if (result.isbn === isbn) {
          data.push({
            ...result,
          });
        }
      }
    });

    //body returns
    let payload = {};

    if (data.length > 0) {
      payload = {
        ...data[0],
      };
    }

    res.status(200).json(payload);
  });

  //endpoint to add book
  server.post("/addBook", async (req, res) => {
    const body = req.body;

    const bookStructure = {
      title: body.title,
      author: body.author,
      isbn: body.isbn,
    };

    const db = admin.firestore();
    await db.collection("books").doc(uuid.v4()).set(bookStructure);

    res.status(200).json({
      status: "done",
    });
  });

  //wildcard
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
