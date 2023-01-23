const express = require("express");
// const mongoose = require("mongoose");
// const { connectToDb, getDb } = require("../server");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
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
    // db.collection("activities")
    //   .find() //cursor
    //   .sort({ todo: 1 })
    //   .forEach((activity) => activities.push(activity))
    //   .then(() => {
    //     res.status(200).json(activities);
    //   });
    // trycatch(() => {
    //   res.status(500).json({ error: "could not fetch documents" });
    // });
    // res.json({ mssg: "welcome to my api" });
    const db = req.app.locals.dbConnection;
    const todo = await db
      .collection("activities")
      .find()
      .sort({ todo: 1 })
      .toArray();
    res.json(todo);
  });

  // server.get("/number_of_activities", (req, res) => {
  //   // res.json("activities");
  //   const db = req.app.locals.dbConnection;
  //   const todo = db.collection("activities").countDocuments().toArray();
  //   if (todo.length <= 0) {
  //     console.log("you have no activity scheduled");
  //     res.json("you have an empty list");
  //   } else {
  //     const db = req.app.locals.dbConnection;
  //     res.json(`you have : ${todo} activities to do`);

  // });
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

  // });

  //post requests

  //   server.post("/save-data", (req, res) => {
  //     // const todo = req.body;
  //     let task = req.body.task;
  //     const db = req.app.locals.dbConnection;
  //     // let time = req.body.time;
  //     console.log(req.body, "<<< req.body");
  //     // const todo = db.collection("activities").find().sort({ todo: 1 }).toArray();

  //     for (let i = 0; i < todo.length; i++) {
  //       if (db[i].task === task) {
  //         return res.json({
  //           error: true,
  //           description: "this task is already on the list",
  //         });
  //       }
  //     }

  //     db.push(req.body);
  //     console.log(req.body);
  //     res.json({
  //       error: true,
  //       description: "your task has been successfully added to the list.",
  //     });
  //   });

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
  //         res.status(200).json(result);
  //       })
  //       .catch((err) => {
  //         res.status(500).json({ error: "could not delete document" });
  //       });
  //   } else {
  //     res.status(500).json({ error: "not a valid  doc id" });
  //   }
  // });
}

module.exports = appRouters;
