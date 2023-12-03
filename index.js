var admin = require("firebase-admin");

var serviceAccount = require("./entrio-task-firebase-adminsdk-g83xl-abe8bf7341.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://entrio-task-default-rtdb.firebaseio.com/",
});

const db = admin.database();
const testsRef = db.ref("/tests");

const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Live on port ${PORT}`);
});

async function getAllTests() {
  try {
    const snapshot = await testsRef.once("value");
    return snapshot.val();
  } catch (error) {
    console.error("Error getting tests from Firebase:", error);
    throw error;
  }
}

app.get("/tests", async (req, res) => {
  const allTests = await getAllTests();
  try {
    // Parse the JSON data
    const jsonData = JSON.parse(allTests);

    // Send the JSON data to the Angular app
    res.json(jsonData);
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    res.status(500).send("Internal Server Error");
  }
});
