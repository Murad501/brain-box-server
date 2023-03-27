const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("data is coming soon");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@user1.istzhai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const researchCollections = client.db("Brain_Box").collection("researches");

    app.get("/", (req, res) => {});

    app.get("/researches", async (req, res) => {
      const query = { isPrivate: false };
      const result = await researchCollections.find(query).toArray();
      res.send(result);
    });

    app.post("/researches", async (req, res) => {
      const research = req.body;
      const result = await researchCollections.insertOne(research);
      res.send(result);
    });

    app.put("/researches/comment-update/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const comment = req.body.comment;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          "actions.comment": comment,
        },
      };

      const result = await researchCollections.updateOne(query, updateDoc);
      res.send(result);
    });

    app.put("/researches/like-update/:id", async (req, res) => {
      const id = req.params.id;
      const love = req.body.love;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          "actions.love": love,
        },
      };

      const result = await researchCollections.updateOne(query, updateDoc);
      res.status(200).json(result);
    });
  } catch {}
};

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("server is running on port", port);
});
