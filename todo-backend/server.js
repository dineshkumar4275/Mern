//Using Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//create instance of express.
const app = express();
app.use(express.json());
app.use(cors());

//start the server
const port = 8080;
app.listen(port, '0.0.0.0', () => {
  console.log("Server is listening on port " + port);
});



//connecting mongoDb
mongoose
  .connect("mongodb+srv://dineshkumar4275:2Kcandy427585@mongo-tutorial.nlajwc6.mongodb.net/?appName=mongo-tutorial")
  .then(() => console.log("DB Conntected"))
  .catch((e) => console.log(e));

//creating schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
});

//creating model
const todoModel = mongoose.model("Todos", todoSchema);

//create new TODO items
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newToDo = new todoModel({ title, description });
    await newToDo.save();
    res.status(201).json(newToDo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//get all items
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

//update todo items
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedToDo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );

    if (!updatedToDo) {
      res.status(404).json({ messge: "ToDO not Found" });
    }

    res.status(200).json(updatedToDo);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

//delete items
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
