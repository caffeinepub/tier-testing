import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { Gamemode, Tier, RankedPerson } from "../backend";

export function useGetAllTiers(gamemode: Gamemode) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tiers", gamemode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTiers(gamemode);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLeaderboard(gamemode: Gamemode) {
  const { actor, isFetching } = useActor();
  return useQuery<RankedPerson[]>({
    queryKey: ["leaderboard", gamemode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard(gamemode);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPerson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gamemode,
      tier,
      person,
      accessCode,
    }: {
      gamemode: Gamemode;
      tier: Tier;
      person: string;
      accessCode: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addPersonToTier(gamemode, tier, person, accessCode);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tiers", variables.gamemode] });
    },
  });
}

export function useRemovePerson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gamemode,
      tier,
      person,
      accessCode,
    }: {
      gamemode: Gamemode;
      tier: Tier;
      person: string;
      accessCode: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.removePersonFromTier(gamemode, tier, person, accessCode);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tiers", variables.gamemode] });
    },
  });
}
