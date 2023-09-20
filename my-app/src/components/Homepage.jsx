import React, { useEffect, useState } from "react";
import { Button, notification } from "antd";
import {
  BrowserRouter,
  Routes,
  Route,
  Router,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
function Homepage() {
  const [dataGame, setDataGame] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const navigate = useNavigate();

  const fetchDataGame = () => {
    axios
      .get("http://localhost:5000/api/database/")
      .then((response) => {
        setDataGame(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchDataGame();
  }, []);

  const handleCreateGame = () => {
    if (!player1 || !player2 || !player3 || !player4) {
      notification.success({
        message: "Please Fill All 4 Players",
        placement: "topRight",
      });
      return;
    }

    const newGame = {
      players: [
        {
          idPlayer: 1,
          name: player1,
          rounds: [],
        },
        {
          idPlayer: 2,
          name: player2,
          rounds: [],
        },
        {
          idPlayer: 3,
          name: player3,
          rounds: [],
        },
        {
          idPlayer: 4,
          name: player4,
          rounds: [],
        },
      ],
    };
    axios
      .post("http://localhost:5000/api/database/create", newGame)
      .then((response) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="score-keeper-board">
        <h1>Score Keeper</h1>
        <div className="group-player-input">
          <input
            type="text"
            placeholder="Type player 1"
            value={player1}
            onChange={(event) => setPlayer1(event.target.value)}
          />
          <input
            type="text"
            placeholder="Type player 2"
            value={player2}
            onChange={(event) => setPlayer2(event.target.value)}
          />
          <input
            type="text"
            placeholder="Type player 3"
            value={player3}
            onChange={(event) => setPlayer3(event.target.value)}
          />
          <input
            type="text"
            placeholder="Type player 4"
            value={player4}
            onChange={(event) => setPlayer4(event.target.value)}
          />
        </div>
        <Button
          type="primary"
          className="create-game-btn"
          onClick={handleCreateGame}
        >
          Create Game
        </Button>
      </div>
    </>
  );
}

export default Homepage;
