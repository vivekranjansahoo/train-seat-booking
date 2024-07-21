// insertData.js
import mongoose from "mongoose";
import Train from "../backend/model/train.js"; // Update with the correct path

const uri =
  "mongodb+srv://vivekranjansahoo81:train@cluster0.ylzwlnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB connection string

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    testComplexData();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Function to insert data

const testComplexData = async () => {
  const complexTrainData = new Train({
    coach: {
      seats: [
        { number: 1, row: 1, isBooked: true },
        { number: 2, row: 1, isBooked: false },
        { number: 3, row: 1, isBooked: true },
        { number: 4, row: 2, isBooked: false },
        { number: 5, row: 2, isBooked: true },
        { number: 6, row: 2, isBooked: false },
        { number: 7, row: 3, isBooked: false },
        { number: 8, row: 3, isBooked: true },
        { number: 9, row: 3, isBooked: false },
        { number: 10, row: 4, isBooked: true },
      ],
    },
    bookings: [
      {
        seats: [1, 3, 5, 8],
        createdAt: new Date(),
      },
      {
        seats: [10],
        createdAt: new Date(),
      },
    ],
  });

  await complexTrainData.save();
  console.log("Complex train data saved successfully");
};
