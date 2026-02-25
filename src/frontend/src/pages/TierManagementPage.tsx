import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Gamemode, Tier } from "../backend";
import { useGetAllTiers, useAddPerson, useRemovePerson } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ArrowLeft, UserPlus, Trash2, Loader2, Trophy } from "lucide-react";

const tierOrder: Tier[] = [
  Tier.LT5,
  Tier.HT5,
  Tier.LT4,
  Tier.HT4,
  Tier.LT3,
  Tier.HT3,
  Tier.LT2,
  Tier.HT2,
  Tier.LT1,
  Tier.HT1,
];

const tierLabels: Record<Tier, string> = {
  [Tier.LT5]: "Low Tier 5",
  [Tier.HT5]: "High Tier 5",
  [Tier.LT4]: "Low Tier 4",
  [Tier.HT4]: "High Tier 4",
  [Tier.LT3]: "Low Tier 3",
  [Tier.HT3]: "High Tier 3",
  [Tier.LT2]: "Low Tier 2",
  [Tier.HT2]: "High Tier 2",
  [Tier.LT1]: "Low Tier 1",
  [Tier.HT1]: "High Tier 1",
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

export default function TierManagementPage() {
  const { gamemode } = useParams({ from: "/tier/$gamemode" });
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedTier, setSelectedTier] = useState<Tier>(Tier.LT5);
  const [addCode, setAddCode] = useState("");
  const [removeCode, setRemoveCode] = useState("");
  const [personToRemove, setPersonToRemove] = useState<{
    person: string;
    tier: Tier;
  } | null>(null);

  const { data: tiersData, isLoading } = useGetAllTiers(gamemode as Gamemode);
  const addMutation = useAddPerson();
  const removeMutation = useRemovePerson();

  const tierMap = new Map(tiersData || []);

  const handleAddPerson = async () => {
    if (!newPersonName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (addCode !== "65515616151") {
      toast.error("Incorrect access code");
      return;
    }

    try {
      await addMutation.mutateAsync({
        gamemode: gamemode as Gamemode,
        tier: selectedTier,
        person: newPersonName.trim(),
        accessCode: addCode,
      });
      toast.success(`Added ${newPersonName} to ${tierLabels[selectedTier]}`);
      setShowAddDialog(false);
      setNewPersonName("");
      setAddCode("");
      setSelectedTier(Tier.LT5);
    } catch (error) {
      toast.error("Failed to add person. Check your code and try again.");
    }
  };

  const handleRemovePerson = async () => {
    if (!personToRemove) return;

    if (removeCode !== "65515616151") {
      toast.error("Incorrect access code");
      return;
    }

    try {
      await removeMutation.mutateAsync({
        gamemode: gamemode as Gamemode,
        tier: personToRemove.tier,
        person: personToRemove.person,
        accessCode: removeCode,
      });
      toast.success(`Removed ${personToRemove.person}`);
      setShowRemoveDialog(false);
      setRemoveCode("");
      setPersonToRemove(null);
    } catch (error) {
      toast.error("Failed to remove person. Check your code and try again.");
    }
  };

  const openRemoveDialog = (person: string, tier: Tier) => {
    setPersonToRemove({ person, tier });
    setShowRemoveDialog(true);
  };

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
              <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
                {gamemode?.toUpperCase()} TIER RANKINGS
              </h1>
              <p className="text-muted-foreground mt-2 font-body">
                Manage player rankings across all tiers
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/leaderboard" })}
                size="lg"
                className="font-display font-bold"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                size="lg"
                className="font-display font-bold shadow-glow"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Person
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tierOrder.map((tier, index) => {
              const people = tierMap.get(tier) || [];
              return (
                <Card
                  key={tier}
                  className="border-2 overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "fadeIn 0.5s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  <CardHeader className={`${tierColors[tier]}/10 border-b-2 ${tierColors[tier].replace("text-", "border-")}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-display font-bold tracking-tight">
                          {tier}
                        </CardTitle>
                        <CardDescription className="text-foreground/70 font-body mt-1">
                          {tierLabels[tier]}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-lg font-display font-bold px-3 py-1"
                      >
                        {people.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    {people.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8 font-body italic">
                        No players in this tier yet
                      </p>
                    ) : (
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {people.map((person) => (
                            <div
                              key={person}
                              className="flex items-center justify-between p-3 rounded bg-secondary/50 hover:bg-secondary transition-colors group"
                            >
                              <span className="font-body font-medium">
                                {person}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openRemoveDialog(person, tier)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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

      {/* Add Person Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              Add Person to Tier
            </DialogTitle>
            <DialogDescription className="font-body">
              Enter the person's name, select a tier, and provide the access code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body font-semibold">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier" className="font-body font-semibold">
                Tier
              </Label>
              <Select
                value={selectedTier}
                onValueChange={(value) => setSelectedTier(value as Tier)}
              >
                <SelectTrigger id="tier" className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tierOrder.map((tier) => (
                    <SelectItem key={tier} value={tier} className="font-body">
                      {tierLabels[tier]} ({tier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-code" className="font-body font-semibold">
                Access Code
              </Label>
              <Input
                id="add-code"
                type="password"
                placeholder="Enter access code"
                value={addCode}
                onChange={(e) => setAddCode(e.target.value)}
                className="font-body"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setNewPersonName("");
                setAddCode("");
                setSelectedTier(Tier.LT5);
              }}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPerson}
              disabled={addMutation.isPending}
              className="font-display font-bold"
            >
              {addMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Person
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Person Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              Remove Person
            </DialogTitle>
            <DialogDescription className="font-body">
              Enter the access code to remove {personToRemove?.person} from{" "}
              {personToRemove?.tier}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="remove-code" className="font-body font-semibold">
                Access Code
              </Label>
              <Input
                id="remove-code"
                type="password"
                placeholder="Enter access code"
                value={removeCode}
                onChange={(e) => setRemoveCode(e.target.value)}
                className="font-body"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRemoveDialog(false);
                setRemoveCode("");
                setPersonToRemove(null);
              }}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemovePerson}
              disabled={removeMutation.isPending}
              className="font-display font-bold"
            >
              {removeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
