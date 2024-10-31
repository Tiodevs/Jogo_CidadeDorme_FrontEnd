"use client";

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

  useEffect(() => {
    getPlayers();
  }, []);

  console.log(players)

  return (
    <div>
      <div>
        {players.map((item: any) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <h1>{item.id}</h1>
          </div>
        ))}
      </div>

      <button onClick={()=> assignclasses()}>Começar jogo</button>

      <form onSubmit={onSubmit}>
        <input type="text" required name="name" placeholder="name" />
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}
