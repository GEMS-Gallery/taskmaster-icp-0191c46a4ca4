import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";

actor {
  type Task = {
    id: Nat;
    text: Text;
    categoryId: Nat;
  };

  type Category = {
    id: Nat;
    name: Text;
  };

  stable var nextTaskId: Nat = 0;
  stable var taskEntries: [(Nat, Task)] = [];
  let tasks = HashMap.fromIter<Nat, Task>(taskEntries.vals(), 0, Nat.equal, Nat.hash);

  stable let categories: [Category] = [
    { id = 1; name = "Work" },
    { id = 2; name = "Personal" },
    { id = 3; name = "Shopping" },
    { id = 4; name = "Health" }
  ];

  public func addTask(text: Text, categoryId: Nat): async Nat {
    let id = nextTaskId;
    nextTaskId += 1;
    let task: Task = {
      id = id;
      text = text;
      categoryId = categoryId;
    };
    tasks.put(id, task);
    id
  };

  public func deleteTask(id: Nat): async Bool {
    switch (tasks.remove(id)) {
      case null { false };
      case (?_) { true };
    }
  };

  public query func getTasks(): async [Task] {
    Array.map<(Nat, Task), Task>(
      Array.sort<(Nat, Task)>(
        Iter.toArray(tasks.entries()),
        func(a, b) { Nat.compare(a.0, b.0) }
      ),
      func(entry) { entry.1 }
    )
  };

  public query func getCategories(): async [Category] {
    categories
  };

  system func preupgrade() {
    taskEntries := Iter.toArray(tasks.entries());
  };

  system func postupgrade() {
    taskEntries := [];
  };
}