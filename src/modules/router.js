const express = require("express");
// const mongoose = require("mongoose");
// const { connectToDb, getDb } = require("../server");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
// const Blog = require("./models/blog");
// const data = require("./activities.js");
// const { db } = require("./models/blog");

function appRouters(server) {
  // const todoList = data.todos;

  //data base connection
  //mongodb sample sandbox controllers
  //set routers
  let activities = [];

  server.get("/get-list", async (req, res) => {
    const db = req.app.locals.dbConnection;
    const todo = await db
      .collection("activities")
      .find()
      .sort({ todo: 1 })
      .toArray();
    res.json(todo);
  });

  server.get("/number-of-activities", (req, res) => {
    const db = req.app.locals.dbConnection;
    db.collection("activities").countDocuments((err, count) => {
      if (err) throw err;
      if (count <= 0) {
        console.log("you have no activity scheduled");
        res.json("you have an empty list");
      } else {
        res.json(`you have : ${count} activities to do`);
      }
    });
  });

  server.post("/save-data", (req, res) => {
    // Get the task from the request body
    const task = req.body.task;

    // Get the MongoDB client from the request object
    const db = req.app.locals.dbConnection;

    // Connect to the 'activities' collection

    // const collection = client.db("todoapi").collection("activities");
    db.collection("activities")

      // Check if the task already exists in the collection
      .findOne({ task: task }, (err, existingTask) => {
        if (existingTask) {
          return res.json({
            error: true,
            description: "This task is already on the list",
          });
        }

        // Insert the new task into the collection
        db.collection("activities").insertOne({ task: task }, (err, result) => {
          if (err) {
            console.log(err);
            return res.json({
              error: true,
              description: "An error occurred while saving the task",
            });
          }
          res.json({
            error: false,
            description: "Task added successfully",
          });
        });
      });
  });

  server.delete("/activities/:id", (req, res) => {
    const db = req.app.locals.dbConnection;
    if (ObjectId.isValid(req.params.id)) {
      db.collection("activities")
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then((result) => {
          if (result.deletedCount > 0) {
            res.status(204).end();
          } else {
            res.status(404).json({ error: "resource not found" });
          }
        })
        .catch((err) => {
          res.status(500).json({ error: "could not delete document" });
        });
    } else {
      res.status(400).json({ error: "not a valid  doc id" });
    }
  });

  //for the signup page
  server.post("/signup", async (req, res) => {
    const db = req.app.locals.dbConnection;
    db.collection("signup");
    const user = req.body;

    //hash users password for security
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    db.collection("signup").insertOne({ user: user }, (err, result) => {
      if (err) {
        return res.json({
          status: 409,
          // error: true,
          description: "This user is already registered",
        });
      }
      res.json({
        status: 200,
        error: false,
        description: "user created successfully",
      });
    });

    // res
    //   .json({
    //     error: false,
    //     description: "user created successfully",
    //   })
    //   .catch((err) => {
    //     res.status(500).json({ error: "could not create user" });
    //   });
  });
  server.post("/login", async (req, res) => {
    try {
      const db = req.app.locals.dbConnection;
      db.collection("signup");
      const user = req.body;

      const foundUser = await db
        .collection("signup")
        .findOne({ "user.email": user.email });

      if (!foundUser) {
        return res.status(401).json({
          description: "Email or password is incorrect",
        });
      }

      //comparing the submitted password to the hashed password in the database
      const passwordsMatch = await bcrypt.compare(
        user.password,
        foundUser.user.password
      );
      if (!passwordsMatch) {
        //setting a session or token to indicate the is logged in
        return res.status(401).json({
          description: "Email or password is incorrect",
        });
      }
      if (user === "") {
        return res.status(401).json({
          description: "please enter your email and password",
        });
      } else {
        res.json({
          description: "logged in successfully",
          status: true,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "error" });
    }

    // trycatch((err) => {
    //   ;
    // });
  });
}

module.exports = appRouters;
