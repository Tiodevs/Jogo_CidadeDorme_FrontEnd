"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { handleAddPlayer } from "../actions/serverActions"; // Importa a função do servidor
import { api } from "../services/api";

interface Props {
  params: {
    roomId: string;
  };
}

export default function Home({ params }: Props) {
  const decodedId = decodeURIComponent(params.roomId as string).trim();

  const [players, setPlayers] = useState<any>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Evita o recarregamento da página
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    await handleAddPlayer(name, decodedId);
    getPlayers();
  }

  async function getPlayers() {
    const roomRes = await api.post("/rooms/list", {
      room_id: decodedId,
    });

    const playersRes = roomRes.data.Players;
    setPlayers(playersRes);
  }

  async function assignclasses() {
    await api.post("/assignclasses", {
      room_id: decodedId,
    });
    console.log("Adicionar classes")
  }

  function handleRedirect(id: string) {
    window.location.href = `/${decodedId}/${id}`;
  }

  useEffect(() => {
    getPlayers();
  }, []);

  console.log(players)

  return (
    <div className={styles.containerCenter}>

      <h1 className={styles.title}>Entrar no jogo</h1>

      <div className={styles.jogadoressection}>
        {players.map((item: any) => (
          <div key={item.id} className={styles.jogadores}>
            <h1>{item.name}</h1>
            <button onClick={() => handleRedirect(item.id)}>Entrar</button>
          </div>
        ))}
      </div>


      <button className={styles.btn} onClick={() => assignclasses()}>Começar jogo</button>

      <div className={styles.form}>
        <form onSubmit={onSubmit}>
          <label>Nome</label>
          <input type="text" required name="name" />
          <button type="submit">Adicionar</button>
        </form>
      </div>
    </div>
  );
}
