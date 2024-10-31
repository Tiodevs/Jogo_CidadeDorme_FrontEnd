"use client"; // Habilita o componente do lado do cliente

import styles from "./page.module.scss";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { handleRegister } from "./actions/serverActions"; // Importa a função do servidor

export default function Home() {
  const [error, setError] = useState<string | null>(null); // Para capturar erros no cliente

  async function onSubmit(formData: FormData) {
    setError(null)
    try {
      console.log(formData)
      const response = await handleRegister(formData);
      window.location.href = `/${response.id}`;
    } catch (err: any) {
      setError("Erro ao criar a sala");
      toast.warning(error);
    }
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <h1>Criar Sala</h1>

        <section className={styles.login}>
          <form action={onSubmit}>
            <input
              type="text"
              required
              name="CountPerson"
              placeholder="CountPerson"
              className={styles.input}
            />
            <input
              type="text"
              required
              name="CountPolice"
              placeholder="CountPolice"
              className={styles.input}
            />
            <input
              type="text"
              required
              name="CountKiller"
              placeholder="CountKiller"
              className={styles.input}
            />
            <input
              type="text"
              required
              name="CountHealer"
              placeholder="CountHealer"
              className={styles.input}
            />

            <button type="submit">Criar</button>
          </form>

          {error ? <p className={styles.error}>{error}</p>: <></>}
        </section>
      </div>
    </>
  );
}
