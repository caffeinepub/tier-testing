# Tier Testing Website

## Current State

The application currently supports 7 gamemodes (Axe, Sword, Mace, Spearmace, Crystal, SMP, DiamondSMP), each with its own set of 10 tiers (LT5, HT5, LT4, HT4, LT3, HT3, LT2, HT2, LT1, HT1). Users can:
- Select a gamemode from the main page
- Add people to any tier within a gamemode (requires access code 65515616151)
- Remove people from any tier (requires access code 65515616151)
- View all tiers and their members for each gamemode

The backend stores tier data using nested maps (gamemode → tier → list of people). The frontend displays gamemodes as cards on the home page and shows tier management on a separate page per gamemode.

## Requested Changes (Diff)

### Add
- **UHC gamemode**: Add UHC (Ultra Hardcore) as the 8th gamemode with its own 10-tier structure
- **Leaderboard feature**: Add a leaderboard system that displays the top 100 people per gamemode, ranked by tier placement (HT1 highest, LT5 lowest)
- **Leaderboard navigation**: Add a way to view leaderboards from the UI (button or menu item)
- **Leaderboard page/section**: Display rank number, person name, and tier for each entry

### Modify
- Backend Gamemode enum to include UHC
- Frontend gamemode configuration to include UHC with an appropriate icon
- Navigation structure to support leaderboard viewing

### Remove
- Nothing removed

## Implementation Plan

1. **Backend changes**:
   - Add `#UHC` variant to the Gamemode type
   - Update Gamemode.toText() and Gamemode.compare() to handle UHC
   - Add a new query function `getLeaderboard(gamemode: Gamemode)` that:
     - Retrieves all tiers for the specified gamemode
     - Flattens and sorts people by tier rank (HT1 → HT2 → ... → LT5)
     - Returns up to 100 entries with rank, name, and tier
     - Assigns rank numbers based on tier order

2. **Frontend changes**:
   - Update GamemodeSelectionPage to include UHC gamemode with an appropriate icon (e.g., Heart or Shield)
   - Create a new LeaderboardPage component that:
     - Shows a gamemode selector
     - Fetches and displays leaderboard data for the selected gamemode
     - Displays rank, player name, and tier in a table or list format
   - Add a "Leaderboard" button or navigation link on the main page and/or tier management pages
   - Update routing to support the leaderboard page
   - Create a useGetLeaderboard hook to fetch leaderboard data

3. **Validation**:
   - Run typecheck, lint, and build to ensure no errors
   - Test UHC gamemode tier management
   - Test leaderboard display for each gamemode

## UX Notes

- The leaderboard should clearly indicate rank progression (e.g., #1, #2, #3...)
- Tier badges should use the same color scheme as the tier management page for consistency
- Leaderboards are read-only (no add/remove actions from leaderboard view)
- Each gamemode has its own separate leaderboard (not combined across gamemodes)
- If a gamemode has no people added yet, show an empty state message
