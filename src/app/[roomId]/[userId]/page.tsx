"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { handleAddPlayer } from "../../actions/serverActions"; // Importa a função do servidor
import { api } from "../../services/api";

interface Props {
  params: {
    roomId: string;
    userId: string;
  };
}

export default function Home({ params }: Props) {

  const decodedId = decodeURIComponent(params.roomId as string).trim();
  const decodedId2 = decodeURIComponent(params.userId as string).trim();

  const [allPlayers, setAllPlayers] = useState<any>([]);
  const [atualPlayer, setAtualPlayer] = useState<any>([]);
  const [players, setPlayers] = useState<any>([]);
  const [day, setDay] = useState<number>(0);




  async function getPlayers() {
    const roomRes = await api.post("/rooms/list", {
      room_id: decodedId,
    });

    const playersRes = roomRes.data.Players;

    const dayres = roomRes.data.Day

    setDay(dayres)

    setAllPlayers(playersRes)

    const playerFilter = playersRes.filter((item: any) => item.id != decodedId2)
    const playerFilter2 = playerFilter.filter((item: any) => item.life >= 2)

    setPlayers(playerFilter2);
  }

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    const playerAtual = allPlayers.filter((item: any) => item.id === decodedId2)
    setAtualPlayer(playerAtual[0])
  }, [allPlayers]);


  function handleRedirect(id: string) {
    window.location.href = `/${decodedId}/${decodedId2}/votes`;
  }

  async function handleAtacar(id: string) {

    const playerAtacar = allPlayers.filter((item: any) => item.id === id)

    const newLifes = playerAtacar[0].life - 1

    await api.put("/players/life", {
      user_id: id,
      life: newLifes,
    });

    if (newLifes <= 1) {
      await api.post("/history", {
        history: `O ${playerAtacar[0].name} morreu`,
        day: day,
        roomId: decodedId
      });
    }

    window.location.href = `/${decodedId}/${decodedId2}/votes`;
  }

  async function handleCurar(id: string) {

    const playerCurar = allPlayers.filter((item: any) => item.id === id)

    await api.put("/players/life", {
      user_id: id,
      life: 2,
    });

    await api.post("/history", {
      history: `O ${playerCurar[0].name} foi curado`,
      day: day,
      roomId: decodedId
    });

    window.location.href = `/${decodedId}/${decodedId2}/votes`;

  }

  async function handleInvestigar(id: string) {

    const playerInvestigar = allPlayers.filter((item: any) => item.id === id)

    if (playerInvestigar[0].category === "ASSASSINO") {
      await api.post("/history", {
        history: `O investigador descobriu quem é o assasino`,
        day: day,
        roomId: decodedId
      });
    } else {
      await api.post("/history", {
        history: `O não descobriu quem é o assasino`,
        day: day,
        roomId: decodedId
      });
    }

    window.location.href = `/${decodedId}/${decodedId2}/votes`;

  }

  console.log(atualPlayer)


  return (
    <div className={styles.containerCenter}>

      {atualPlayer && atualPlayer.life >= 2 ? <div>
        {atualPlayer && atualPlayer.category === "ASSASSINO" ? <img src="/cardKiller.png" alt="" /> : <></>}
      {atualPlayer && atualPlayer.category === "CURANDEIRO" ? <img src="/CardMedico.png" alt="" /> : <></>}
      {atualPlayer && atualPlayer.category === "POLÍCIA" ? <img src="/cardDetetive.png" alt="" /> : <></>}
      {atualPlayer && atualPlayer.category === "CIDADÃO" ? <img src="/cardCidadao.png" className={styles.card} /> : <></>}
      </div> : <></>}

      {atualPlayer && atualPlayer.life >= 2 ? <div className={styles.jogadoressection}>
        {players.map((item: any) => (

          <div key={item.id} className={styles.jogadores}>
            <h1>{item.name}</h1>
            {atualPlayer && atualPlayer.category === "ASSASSINO" ? <button onClick={() => handleAtacar(item.id)}>Atacar</button> : <></>}
            {atualPlayer && atualPlayer.category === "CURANDEIRO" ? <button onClick={() => handleCurar(item.id)}>Curar</button> : <></>}
            {atualPlayer && atualPlayer.category === "POLÍCIA" ? <button onClick={() => handleInvestigar(item.id)}>Investigar</button> : <></>}
            {atualPlayer && atualPlayer.category === "CIDADÃO" ? <button onClick={() => handleRedirect(item.id)}>Dormir</button> : <></>}
          </div>

        ))}
      </div> : <div>
        <h1 className={styles.title}>Você esta morto</h1>
        <p className={styles.title2}>Os jogadores são:</p>
        {allPlayers.map((item: any) => (
          <div key={item.id}>
            <h1 className={styles.title}>{item.name}</h1>
            <h1 className={styles.title2}>{item.category}</h1>
            <h1 className={styles.title2}>Quantidade de vidas {item.life}</h1>
          </div>
        ))}

      </div>}
    </div>
  );
}
