import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : bigint, 'name' : string }
export interface Task {
  'id' : bigint,
  'categoryId' : bigint,
  'text' : string,
  'completed' : boolean,
}
export interface _SERVICE {
  'addTask' : ActorMethod<[string, bigint], bigint>,
  'deleteTask' : ActorMethod<[bigint], boolean>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getTasks' : ActorMethod<[], Array<Task>>,
  'toggleTaskCompletion' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
