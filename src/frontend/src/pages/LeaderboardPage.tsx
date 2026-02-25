import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Gamemode, Tier } from "../backend";
import { useGetLeaderboard } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Trophy, Medal, Award, Loader2 } from "lucide-react";

const gamemodeLabels: Record<Gamemode, string> = {
  [Gamemode.Axe]: "Axe",
  [Gamemode.Sword]: "Sword",
  [Gamemode.Mace]: "Mace",
  [Gamemode.Spearmace]: "Spearmace",
  [Gamemode.Crystal]: "Crystal",
  [Gamemode.SMP]: "SMP",
  [Gamemode.DiamondSMP]: "DiamondSMP",
  [Gamemode.UHC]: "UHC",
};

const tierColors: Record<Tier, string> = {
  [Tier.LT5]: "bg-chart-5 text-chart-5",
  [Tier.HT5]: "bg-chart-1 text-chart-1",
  [Tier.LT4]: "bg-chart-4 text-chart-4",
  [Tier.HT4]: "bg-chart-2 text-chart-2",
  [Tier.LT3]: "bg-chart-3 text-chart-3",
  [Tier.HT3]: "bg-chart-1 text-chart-1",
  [Tier.LT2]: "bg-chart-5 text-chart-5",
  [Tier.HT2]: "bg-chart-2 text-chart-2",
  [Tier.LT1]: "bg-chart-4 text-chart-4",
  [Tier.HT1]: "bg-chart-1 text-chart-1",
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
  return null;
};

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [selectedGamemode, setSelectedGamemode] = useState<Gamemode>(Gamemode.Axe);
  const { data: leaderboard, isLoading } = useGetLeaderboard(selectedGamemode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            className="mb-4 font-body"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gamemodes
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
                <Trophy className="w-10 h-10 text-primary" />
                LEADERBOARDS
              </h1>
              <p className="text-muted-foreground mt-2 font-body">
                Top 100 ranked players across all gamemodes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-2">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold">
              Select Gamemode
            </CardTitle>
            <CardDescription className="font-body">
              Choose a gamemode to view its leaderboard
            </CardDescription>
            <Select
              value={selectedGamemode}
              onValueChange={(value) => setSelectedGamemode(value as Gamemode)}
            >
              <SelectTrigger className="w-full mt-4 font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Gamemode).map((gamemode) => (
                  <SelectItem key={gamemode} value={gamemode} className="font-body">
                    {gamemodeLabels[gamemode]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {leaderboard.map((entry) => {
                    const rankNum = Number(entry.rank);
                    return (
                      <div
                        key={`${entry.name}-${entry.rank}`}
                        className="flex items-center justify-between p-4 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 flex items-center justify-center">
                            {getRankIcon(rankNum) || (
                              <span className="text-lg font-display font-bold text-muted-foreground">
                                #{rankNum}
                              </span>
                            )}
                          </div>
                          <span className="font-body font-semibold text-lg">
                            {entry.name}
                          </span>
                        </div>
                        <Badge
                          className={`${tierColors[entry.tier]}/20 border-2 ${tierColors[entry.tier].replace("text-", "border-")} font-display font-bold px-3 py-1`}
                        >
                          {entry.tier}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-24">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-body text-lg">
                  No players ranked in {gamemodeLabels[selectedGamemode]} yet.
                </p>
                <p className="text-muted-foreground/70 font-body text-sm mt-2">
                  Add players to tiers to see them appear on the leaderboard!
                </p>
                <Button
                  onClick={() => navigate({ to: "/tier/$gamemode", params: { gamemode: selectedGamemode } })}
                  className="mt-6 font-display font-bold"
                  size="lg"
                >
                  Manage {gamemodeLabels[selectedGamemode]} Tiers
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
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
    </div>
  );
}
