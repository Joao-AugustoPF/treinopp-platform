import type { RawRuleOf, MongoAbility, ForcedSubject } from '@casl/ability';

import { createMongoAbility } from '@casl/ability';

export interface IPermission {
  id: string;
  name: string;
  action: Action;
  subject: Subject;
}

export interface IPolicy {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: IPermission[];
}

export interface IRole extends IPolicy {
  policies: IPolicy[];
}

export const actions = ['create', 'read', 'update', 'delete'] as const;
export const subjects = ['User', 'Company', 'Product', 'Order'] as const;

export type Action = (typeof actions)[number];
export type Subject = (typeof subjects)[number];

export type Abilities = [
  (typeof actions)[number],
  (typeof subjects)[number] | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>,
];

export type AppAbility = MongoAbility<Abilities>;

export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  createMongoAbility<AppAbility>(rules);
