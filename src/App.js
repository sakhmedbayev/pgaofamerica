import API, { graphqlOperation } from "@aws-amplify/api";
import PubSub from "@aws-amplify/pubsub";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useReducer } from "react";
import config from "./aws-exports";
import AddPlayer from "./components/AddPlayer";
import { createPlayer, deletePlayer } from "./graphql/mutations";
import { listPlayers } from "./graphql/queries";
import { onCreatePlayer, onDeletePlayer } from "./graphql/subscriptions";
import Leaderboard from "./components/Leaderboard";

API.configure(config); // Configure Amplify
PubSub.configure(config);

async function createNewPlayer(values) {
  const player = { ...values };
  await API.graphql(graphqlOperation(createPlayer, { input: player }));
}

async function deleteAPlayer(values) {
  const player = { ...values };
  await API.graphql(graphqlOperation(deletePlayer, { input: player }));
}

const initialState = { players: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "QUERY": {
      return { ...state, players: action.players };
    }
    case "SUBSCRIPTION": {
      if (action.player.subActionType === "add") {
        return {
          ...state,
          players: [...state.players, action.player.player]
        };
      } else {
        const newPlayerList = state.players.filter(item => {
          return (
            item.lastname !== action.player.player.lastname &&
            item.name !== action.player.player.name
          );
        });
        return { ...state, players: newPlayerList };
      }
    }
    default:
      return state;
  }
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        PGA of America
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getData();

    const subscription = API.graphql(
      graphqlOperation(onCreatePlayer)
    ).subscribe({
      next: eventData => {
        const player = eventData.value.data.onCreatePlayer;
        dispatch({
          type: "SUBSCRIPTION",
          player: { player: player, subActionType: "add" }
        });
      }
    });

    const subscriptionForDelete = API.graphql(
      graphqlOperation(onDeletePlayer)
    ).subscribe({
      next: eventData => {
        const player = eventData.value.data.onDeletePlayer;
        dispatch({
          type: "SUBSCRIPTION",
          player: { player: player, subActionType: "delete" }
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      subscriptionForDelete.unsubscribe();
    };
  }, []);

  async function getData() {
    const playerData = await API.graphql(graphqlOperation(listPlayers));
    dispatch({ type: "QUERY", players: playerData.data.listPlayers.items });
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          TOUR Championship
        </Typography>
        <AddPlayer submit={createNewPlayer} />
        <Leaderboard rows={state.players} deletePlayer={deleteAPlayer} />
        <Copyright />
      </Box>
    </Container>
  );
}
