export const idlFactory = ({ IDL }) => {
  const Category = IDL.Record({ 'id' : IDL.Nat, 'name' : IDL.Text });
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'categoryId' : IDL.Nat,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Nat], []),
    'deleteTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'toggleTaskCompletion' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
