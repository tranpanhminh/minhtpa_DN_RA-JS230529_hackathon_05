const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());
// ADD THIS
var cors = require("cors");
app.use(cors());
// Comment
const readFileData = fs.readFileSync("./database/database.json", "utf-8");
const database = JSON.parse(readFileData);
// Get Database
app.get("/api/database", (req, res) => {
  if (database) {
    res.status(200).json(database);
  } else {
    res.status(404).json({ message: "No Data" });
  }
});

// API Game Detail
app.get("/api/database/game/:id", (req, res) => {
  let gameId = req.params.id;
  const findGame = database.find((item) => {
    return item.id == gameId;
  });
  if (gameId) {
    if (findGame) {
      res.status(200).json(findGame);
    } else {
      res.status(404).json({ message: "Game Not Found" });
    }
  }
});

// Create Game API
app.post("/api/database/create", (req, res) => {
  const newGame = req.body;
  if (newGame.players.length !== 4) {
    return res.status(501).json({ message: "Data Error" });
  }

  // Lấy danh sách ID
  let listID = database.map((item) => {
    return item.id;
  });

  // Tìm Max ID
  let maxID = Math.max(...listID);
  newGame.id = maxID + 1;

  // Push NewUser
  database.push(newGame);
  fs.writeFileSync("./database/database.json", JSON.stringify(database));
  res.status(200).json({ message: "Game Created" });
});

// Create Round API
app.post("/api/database/game/:id/add", (req, res) => {
  const roundId = req.params.id;
  let newRound;
  const findGame = database.find((item) => {
    return item.id == roundId;
  });
  const listRoundId = findGame.players[0].rounds.map((item) => {
    return item.idRound;
  });

  newRound = {
    idRound: listRoundId.length !== 0 ? Math.max(...listRoundId) + 1 : 1,
    score: 0,
  };

  console.log(newRound);
  const findGameIndex = database.findIndex((item) => {
    return item.id == roundId;
  });
  database[findGameIndex].players.forEach((item) => {
    return item.rounds.push(newRound);
  });
  console.log(database, "DATABASE");
  if (roundId) {
    if (findGame) {
      fs.writeFileSync("./database/database.json", JSON.stringify(database));
      res.status(200).json({ message: "New Round Added" });
    } else {
      res.status(404).json({ message: "Game Not Found" });
    }
  }
});
//   ------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
