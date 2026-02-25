import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import GamemodeSelectionPage from "./pages/GamemodeSelectionPage";
import TierManagementPage from "./pages/TierManagementPage";
import LeaderboardPage from "./pages/LeaderboardPage";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GamemodeSelectionPage,
});

const tierRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tier/$gamemode",
  component: TierManagementPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

export const routeTree = rootRoute.addChildren([indexRoute, tierRoute, leaderboardRoute]);
