"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { handleAddPlayer } from "../../../actions/serverActions"; // Importa a função do servidor
import { api } from "../../../services/api";

interface Props {
  params: {
    roomId: string;
    userId: string;
  };
}

export default function Home({ params }: Props) {

  const decodedId = decodeURIComponent(params.roomId as string).trim();
  const decodedId2 = decodeURIComponent(params.userId as string).trim();

  console.log("user capture", decodedId2)
  // Todos os players
  const [allPlayers, setAllPlayers] = useState<any>([]);
  // Apenas o plyer atual
  const [atualPlayer, setAtualPlayer] = useState<any>([]);
  // Todos os player exeto o player atual
  const [players, setPlayers] = useState<any>([]);
  // Todos os player exeto o player atual
  const [history, setHistory] = useState<any>([]);
  // Dia da sala
  const [day, setDay] = useState<number>(0);
  // Reultados
  const [results, setResults] = useState<any>("Sem resultados");
  // Pessoa votou?
  const [voteOpen, setVoteOpen] = useState<boolean>(true);



  async function getPlayers() {
    const roomRes = await api.post("/rooms/list", {
      room_id: decodedId,
    });

    const playersRes = roomRes.data.Players;

    const dayres = roomRes.data.Day

    setDay(dayres)

    setAllPlayers(playersRes)

    const playerFilter = playersRes.filter((item: any) => item.id != decodedId2)
    setPlayers(playerFilter);

    const historyRes = await api.post("/history/list", {
      room_id: decodedId,
      day: roomRes.data.Day
    });

    setHistory(historyRes.data)

  }

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    const playerAtual = allPlayers.filter((item: any) => item.id === decodedId2)
    setAtualPlayer(playerAtual[0])
  }, [allPlayers]);


  async function handleVote(id: string) {

    await api.post("/votes", {
      roomId: decodedId,
      day: day,
      playerId: id
    });

    setVoteOpen(!voteOpen)

  }

  async function handleEndVotes() {
    try {
      const voteRes = await api.post("/endvotes", {
        room_id: decodedId
      });
  
      const vote = voteRes.data;
      console.log(vote);
  
      if (vote.playerId) {
        // Filtra o jogador com base no ID mais votado
        const jogadorMaisVotado = allPlayers.find((item: any) => item.id === vote.playerId);
        
        if (jogadorMaisVotado) {
          setResults(`O jogador ${jogadorMaisVotado.name} foi o mais votado`);
        } else {
          setResults("Jogador mais votado não encontrado.");
        }
      } else if (vote.tie) {
        // Exibe mensagem para empate
        setResults("Houve um empate, nenhum jogador foi eliminado.");
      } else {
        setResults("Nenhum voto foi registrado.");
      }
    } catch (error) {
      console.error("Erro ao processar votos:", error);
      setResults("Erro ao processar os votos. Tente novamente.");
    }
  }
  

  async function handleDormir() {
    window.location.href = `/${decodedId}/${decodedId2}`;
  }

  console.log("Player atual:",atualPlayer)
  console.log(history)


  return (
    <div className={styles.containerCenter}>

      {voteOpen === true ? <div>

        <h1 className={styles.title}>Historia da noite</h1>
        <div className={styles.jogadoressection}>
          {history.map((item: any) => (
            <div key={item.id} className={styles.jogadores}>
              <h1>{item.history}</h1>
            </div>
          ))}
        </div>

        <div className={styles.jogadoressection}>
          {players.map((item: any) => (
            <div key={item.id} className={styles.jogadores}>
              <h1>{item.name}</h1>
              <button onClick={() => handleVote(item.id)}>Votar</button>
            </div>
          ))}
        </div>
      </div> : <div>
        
        <p className={styles.resultado}>{results}</p>
        <button onClick={() => handleDormir()} className={styles.btn}>Dormir</button>
        {atualPlayer && atualPlayer.name === "Felipe"? <button onClick={() => handleEndVotes()} className={styles.btn}>Mostrar resultado</button>: <></>}
        
      </div>}

      

    </div>
  );
}
