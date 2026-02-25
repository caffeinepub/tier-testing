import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Tier = {
    #LT5;
    #HT5;
    #LT4;
    #HT4;
    #LT3;
    #HT3;
    #LT2;
    #HT2;
    #LT1;
    #HT1;
  };

  module Tier {
    public func toText(t : Tier) : Text {
      switch (t) {
        case (#LT5) { "LT5" };
        case (#HT5) { "HT5" };
        case (#LT4) { "LT4" };
        case (#HT4) { "HT4" };
        case (#LT3) { "LT3" };
        case (#HT3) { "HT3" };
        case (#LT2) { "LT2" };
        case (#HT2) { "HT2" };
        case (#LT1) { "LT1" };
        case (#HT1) { "HT1" };
      };
    };

    public func compare(tier1 : Tier, tier2 : Tier) : Order.Order {
      switch (tier1, tier2) {
        case (#HT1, #HT1) { #equal };
        case (#HT1, _) { #greater };
        case (_, #HT1) { #less };

        case (#HT2, #HT2) { #equal };
        case (#HT2, _) { #greater };
        case (_, #HT2) { #less };

        case (#HT3, #HT3) { #equal };
        case (#HT3, _) { #greater };
        case (_, #HT3) { #less };

        case (#HT4, #HT4) { #equal };
        case (#HT4, _) { #greater };
        case (_, #HT4) { #less };

        case (#HT5, #HT5) { #equal };
        case (#HT5, _) { #greater };
        case (_, #HT5) { #less };

        case (#LT1, #LT1) { #equal };
        case (#LT1, _) { #greater };
        case (_, #LT1) { #less };

        case (#LT2, #LT2) { #equal };
        case (#LT2, _) { #greater };
        case (_, #LT2) { #less };

        case (#LT3, #LT3) { #equal };
        case (#LT3, _) { #greater };
        case (_, #LT3) { #less };

        case (#LT4, #LT4) { #equal };
        case (#LT4, _) { #greater };
        case (_, #LT4) { #less };

        case (#LT5, #LT5) { #equal };
      };
    };
  };

  type Gamemode = {
    #Axe;
    #Sword;
    #Mace;
    #Spearmace;
    #Crystal;
    #SMP;
    #DiamondSMP;
    #UHC;
  };

  module Gamemode {
    public func toText(g : Gamemode) : Text {
      switch (g) {
        case (#Axe) { "Axe" };
        case (#Sword) { "Sword" };
        case (#Mace) { "Mace" };
        case (#Spearmace) { "Spearmace" };
        case (#Crystal) { "Crystal" };
        case (#SMP) { "SMP" };
        case (#DiamondSMP) { "DiamondSMP" };
        case (#UHC) { "UHC" };
      };
    };

    public func compare(gamemode1 : Gamemode, gamemode2 : Gamemode) : Order.Order {
      switch (gamemode1, gamemode2) {
        case (#Axe, #Axe) { #equal };
        case (#Axe, _) { #less };
        case (_, #Axe) { #greater };
        case (#Sword, #Sword) { #equal };
        case (#Sword, _) { #less };
        case (_, #Sword) { #greater };
        case (#Mace, #Mace) { #equal };
        case (#Mace, _) { #less };
        case (_, #Mace) { #greater };
        case (#Spearmace, #Spearmace) { #equal };
        case (#Spearmace, _) { #less };
        case (_, #Spearmace) { #greater };
        case (#Crystal, #Crystal) { #equal };
        case (#Crystal, _) { #less };
        case (_, #Crystal) { #greater };
        case (#SMP, #SMP) { #equal };
        case (#SMP, _) { #less };
        case (_, #SMP) { #greater };
        case (#DiamondSMP, #DiamondSMP) { #equal };
        case (#DiamondSMP, _) { #less };
        case (_, #DiamondSMP) { #greater };
        case (#UHC, #UHC) { #equal };
      };
    };
  };

  let gamemodes = Map.empty<Gamemode, Map.Map<Tier, List.List<Text>>>();

  type RankedPerson = {
    rank : Nat;
    name : Text;
    tier : Tier;
  };

  func createGamemodeIfNotExist(gamemode : Gamemode) : Map.Map<Tier, List.List<Text>> {
    switch (gamemodes.get(gamemode)) {
      case (null) {
        let newGamemode = Map.empty<Tier, List.List<Text>>();
        gamemodes.add(gamemode, newGamemode);
        newGamemode;
      };
      case (?existingGamemode) { existingGamemode };
    };
  };

  public shared ({ caller }) func addPersonToTier(gamemode : Gamemode, tier : Tier, person : Text, accessCode : Text) : async () {
    if (accessCode != "65515616151") {
      Runtime.trap("Invalid access code. ");
    };

    let modes = createGamemodeIfNotExist(gamemode);

    // Remove person from any existing tier in this gamemode
    for ((tierKey, people) in modes.entries()) {
      let filteredPeople = people.filter(
        func(p) { p != person }
      );
      modes.add(tierKey, filteredPeople);
    };

    switch (modes.get(tier)) {
      case (null) {
        let people = List.empty<Text>();
        people.add(person);
        modes.add(tier, people);
      };
      case (?people) {
        people.add(person);
        modes.add(tier, people);
      };
    };
  };

  public shared ({ caller }) func removePersonFromTier(gamemode : Gamemode, tier : Tier, person : Text, accessCode : Text) : async () {
    if (accessCode != "65515616151") {
      Runtime.trap("Invalid access code. ");
    };

    switch (gamemodes.get(gamemode)) {
      case (null) { Runtime.trap("Gamemode not found ") };
      case (?tiers) {
        switch (tiers.get(tier)) {
          case (null) { Runtime.trap("Tier not found ") };
          case (?people) {
            let updatedPeople = people.filter(
              func(p) { p != person }
            );
            tiers.add(tier, updatedPeople);
          };
        };
      };
    };
  };

  public query ({ caller }) func getAllTiers(gamemode : Gamemode) : async [(Tier, [Text])] {
    switch (gamemodes.get(gamemode)) {
      case (null) { Runtime.trap("Gamemode not found ") };
      case (?tiers) {
        tiers.toArray().map(
          func((tier, people)) {
            (tier, people.toArray());
          }
        );
      };
    };
  };

  public query ({ caller }) func getLeaderboard(gamemode : Gamemode) : async [RankedPerson] {
    switch (gamemodes.get(gamemode)) {
      case (null) { Runtime.trap("Gamemode not found ") };
      case (?tiers) {
        let peopleWithTiers = List.empty<(Text, Tier)>();

        for ((tier, people) in tiers.entries()) {
          for (person in people.values()) {
            peopleWithTiers.add((person, tier));
          };
        };

        let sortedPeople = peopleWithTiers.toArray().sort(
          func(a, b) {
            let tierOrder = Tier.compare(a.1, b.1);
            switch (tierOrder) {
              case (#equal) {
                Text.compare(a.0, b.0);
              };
              case (_) { tierOrder };
            };
          }
        );

        let rankedPeopleList = List.empty<RankedPerson>();
        var currentRank = 1;

        for ((name, tier) in sortedPeople.values()) {
          rankedPeopleList.add({
            rank = currentRank;
            name;
            tier;
          });
          currentRank += 1;
        };

        let rankedPeople = rankedPeopleList.toArray();
        rankedPeople.sliceToArray(0, Nat.min(rankedPeople.size(), 100));
      };
    };
  };
};
