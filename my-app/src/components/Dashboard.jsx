import React, { useEffect, useState } from "react";
import { Button } from "antd";
import "./style.css";
import axios from "axios";
import { useParams } from "react-router-dom";
function Dashboard() {
  const { roundId } = useParams();
  const [dataGame, setDataGame] = useState([]);
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

  const latestGame = dataGame[dataGame.length - 1];

  useEffect(() => {
    fetchDataGame();
  }, []);

  const handleAddRound = (gameId) => {
    const findGame = dataGame?.find((item) => {
      return item.id === gameId;
    });

    const listRoundId = findGame.players[0].rounds?.map((item) => {
      return item.idRound;
    });

    const newRound = {
      idRound: listRoundId.length !== 0 ? Math.max(...listRoundId) + 1 : 1,
      score: 0,
    };

    let findGameIndex = dataGame?.findIndex((item) => {
      return item.id === gameId;
    });

    dataGame[findGameIndex].players?.forEach((item) => {
      return item.rounds?.push(newRound);
    });

    console.log(dataGame, "DATAGAME");

    axios
      .post(`http://localhost:5000/api/database/game/${gameId}/add`, newRound)
      .then((response) => {
        fetchDataGame();
      });
  };

  return (
    <>
      <div className="table-dashboard">
        <table cellPadding={12}>
          <thead>
            <tr className="thead-player">
              <td>#</td>
              {latestGame?.players.map((item) => {
                return (
                  <>
                    <td>{item?.name}</td>
                  </>
                );
              })}
            </tr>
            <tr className="score-thead">
              <td>Sum Of Score()</td>
              {latestGame?.players?.map((item, index) => {
                return (
                  <>
                    <td>
                      {item.rounds?.reduce((accumulator, total) => {
                        return accumulator + total.score;
                      }, 0)}
                    </td>
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {latestGame?.players[0]?.rounds?.length === 0 ? (
              <tr>
                <td>No Rounds</td>
                <td>No Rounds</td>
                <td>No Rounds</td>
                <td>No Rounds</td>
                <td>No Rounds</td>
              </tr>
            ) : (
              latestGame?.players[0]?.rounds?.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>Round {item.idRound}</td>
                      {latestGame?.players?.map((unit) => {
                        return (
                          <td>
                            <input
                              className="input-score"
                              type="number"
                              min={0}
                              defaultValue={unit.rounds[index].score}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  </>
                );
              })
            )}
          </tbody>
        </table>
        <Button
          type="primary"
          className="add-round-btn"
          onClick={() => handleAddRound(latestGame?.id)}
        >
          Add Round
        </Button>
      </div>
    </>
  );
}

export default Dashboard;
