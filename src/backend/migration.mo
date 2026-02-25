import Map "mo:core/Map";
import List "mo:core/List";

module {
  type OldGamemode = { #Axe; #Sword; #Mace; #Spearmace; #Crystal; #SMP; #DiamondSMP };
  type OldActor = {
    gamemodes : Map.Map<OldGamemode, Map.Map<{ #LT5; #HT5; #LT4; #HT4; #LT3; #HT3; #LT2; #HT2; #LT1; #HT1 }, List.List<Text>>>;
  };

  type NewActor = {
    gamemodes : Map.Map<{ #Axe; #Sword; #Mace; #Spearmace; #Crystal; #SMP; #DiamondSMP; #UHC }, Map.Map<{ #HT1; #HT2; #HT3; #HT4; #HT5; #LT1; #LT2; #LT3; #LT4; #LT5 }, List.List<Text>>>;
  };

  public func run(_ : OldActor) : NewActor {
    { gamemodes = Map.empty<{ #Axe; #Sword; #Mace; #Spearmace; #Crystal; #SMP; #DiamondSMP; #UHC }, Map.Map<{ #HT1; #HT2; #HT3; #HT4; #HT5; #LT1; #LT2; #LT3; #LT4; #LT5 }, List.List<Text>>>() };
  };
};
