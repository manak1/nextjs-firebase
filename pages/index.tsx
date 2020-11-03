import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from 'next/link'
import { useAuthentication } from "../hooks/authentication";

export default function Home() {
  const { user } = useAuthentication();

  return (
    <div className={styles.container}>
      <Head>
      <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p>{user?.uid || "未ログイン"}</p>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <Link href="page2">
          <a href="#">Go to page 2</a>
        </Link>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
