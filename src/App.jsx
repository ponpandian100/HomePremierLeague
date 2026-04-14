import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import MatchTable from "./components/MatchTable";
import Points from "./components/Points";
import SomethingWentWrong from "./components/SomethingWentWrong";
import Hot from "./components/Hot";
import PaymentHistory from "./components/PaymentHistory";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [hplData, setHplData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("home");
  // Admin: holds a working copy of match data for editing
  const [adminMatches, setAdminMatches] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json?v=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data?.hpl ?? data?.[0]?.hpl ?? data;
        setHplData(raw);
        // Seed admin panel with raw hpl array
        const hplArr = Array.isArray(raw) ? raw : raw?.hpl ?? [];
        setAdminMatches(hplArr);
      })
      .catch(() => setHplData(null))
      .finally(() => setTimeout(() => setIsLoading(false), 2000));
  }, []);

  if (isLoading) return <Loading />;

  const players = hplData?.players ?? [];
  const matchHistory = Array.isArray(hplData)
    ? hplData
    : hplData?.matchHistory ?? [];

  // Admin panel — full screen, no navbar
  if (active === "admin") {
    return (
      <AdminPanel
        initialData={adminMatches ?? matchHistory}
        onBack={() => setActive("home")}
      />
    );
  }

  const pages = {
    home: (
      <HomePage
        players={players}
        matchHistory={matchHistory}
        onGoAdmin={() => setActive("admin")}
      />
    ),
    points:  <Points  matchHistory={matchHistory} players={players} />,
    matches: <MatchTable matchHistory={matchHistory} players={players} />,
    hot:     <Hot     matchHistory={matchHistory} players={players} />,
    amount:  <PaymentHistory matchHistory={matchHistory} />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]" style={{ paddingBottom: 110 }}>
      {pages[active] ?? <SomethingWentWrong label="Page" />}
      <Navbar active={active} onTabChange={setActive} />
    </div>
  );
}