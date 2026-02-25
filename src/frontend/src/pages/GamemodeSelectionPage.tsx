import { useNavigate } from "@tanstack/react-router";
import { Gamemode } from "../backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sword,
  Axe,
  Hammer,
  Sparkles,
  Mountain,
  Gem,
  Crown,
  Shield,
  Trophy,
} from "lucide-react";

const gamemodeConfig = [
  { id: Gamemode.Axe, label: "Axe", icon: Axe },
  { id: Gamemode.Sword, label: "Sword", icon: Sword },
  { id: Gamemode.Mace, label: "Mace", icon: Hammer },
  { id: Gamemode.Spearmace, label: "Spearmace", icon: Crown },
  { id: Gamemode.Crystal, label: "Crystal", icon: Gem },
  { id: Gamemode.SMP, label: "SMP", icon: Mountain },
  { id: Gamemode.DiamondSMP, label: "DiamondSMP", icon: Sparkles },
  { id: Gamemode.UHC, label: "UHC", icon: Shield },
];

export default function GamemodeSelectionPage() {
  const navigate = useNavigate();

  const handleGamemodeClick = (gamemode: Gamemode) => {
    navigate({ to: "/tier/$gamemode", params: { gamemode } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-5xl font-display font-bold tracking-tight text-foreground">
            TIER TESTING
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            Select a gamemode to manage tier rankings
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate({ to: "/leaderboard" })}
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary-foreground" />
              <span className="text-xl font-display font-bold text-primary-foreground">
                View Leaderboards
              </span>
            </div>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gamemodeConfig.map((gamemode, index) => {
            const Icon = gamemode.icon;
            return (
              <Card
                key={gamemode.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 hover:-translate-y-1 border-2 overflow-hidden"
                onClick={() => handleGamemodeClick(gamemode.id)}
                style={{
                  animationDelay: `${index * 75}ms`,
                  animation: "slideInUp 0.5s ease-out forwards",
                  opacity: 0,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative z-10">
                  <div className="w-16 h-16 mb-4 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-display font-bold tracking-tight">
                    {gamemode.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-muted-foreground font-body">
                    Manage tier rankings →
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <footer className="mt-24 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground font-body">
          © 2026. Built with love using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
