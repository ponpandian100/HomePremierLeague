import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import MatchTable from "./components/MatchTable";
import Points from "./components/Points";
import SomethingWentWrong from "./components/SomethingWentWrong";
import Hot from "./components/Hot";
import PaymentHistory from "./components/PaymentHistory"

export default function App() {
  const [hplData, setHplData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("home");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json?v=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        // Support { hpl:[...] }, [{ hpl:[...] }], or flat array
        const raw = data?.hpl ?? data?.[0]?.hpl ?? data;
        setHplData(raw);
      })
      .catch(() => setHplData(null))
      .finally(() => setTimeout(() => setIsLoading(false), 2000));
  }, []);


  // useEffect(() => {
  //   fetch(`${import.meta.env.BASE_URL}data.json?v=${Date.now()}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // Support both flat HPL shape and the HPL-wrapped shape
  //       const raw = data?.[0]?.hpl ?? data;
  //       setHplData(raw);
  //     })
  //     .catch(() => setHplData(null))
  //     .finally(() => setTimeout(() => setIsLoading(false), 2000));
  // }, []);

  if (isLoading) return <Loading />;

  const players = hplData?.players ?? [];
  // hpl array IS the match history in the new JSON format
  const matchHistory = Array.isArray(hplData)
    ? hplData                          // { hpl:[...] } → raw = hpl array
    : hplData?.matchHistory ?? [];


  const pages = {
    home: <HomePage players={players} matchHistory={matchHistory} />,
    points: <Points matchHistory={matchHistory} players={players} />,
    matches: <MatchTable matchHistory={matchHistory} players={players} />,
    hot: <Hot matchHistory={matchHistory} players={players} />,
    amount: <PaymentHistory matchHistory={matchHistory} />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]" style={{ paddingBottom: 110 }}>
      {pages[active] ?? <SomethingWentWrong label="Page" />}
      <Navbar active={active} onTabChange={setActive} />
    </div>
  );
}