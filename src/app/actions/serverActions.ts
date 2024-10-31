"use server";

import { api } from "../services/api";

export async function handleRegister(formData: FormData) {
  const CountPerson = formData.get("CountPerson");
  const CountPolice = formData.get("CountPolice");
  const CountKiller = formData.get("CountKiller");
  const CountHealer = formData.get("CountHealer");

  if (!CountPerson || !CountPolice || !CountKiller || !CountHealer) {
    throw new Error("Preencha todos os campos");
  }

  const response = await api.post("/rooms", {
    CountHealer: Number(CountHealer),
    CountKiller: Number(CountKiller),
    CountPolice: Number(CountPolice),
    CountPerson: Number(CountPerson)
  });

  return response.data
}

export async function handleAddPlayer( name: any, decodedId: string) {

  console.log(name, "EEEEE", decodedId)

  if (!name || !decodedId) {
    throw new Error("Preencha todos os campos");
  }

  const response = await api.post("/players", {
    name,
    roomId: decodedId
  });

  return response.data
}
