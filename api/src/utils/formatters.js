import { pick } from 'lodash';

export const pickUser = (user) => {
  if (!user) return null;
  return pick(user, [
    '_id',
    'email',
    'name',
    'avatar',
    'phone',
    'userType',
    'isGuest',
    'lastActivityDate',
    'createdAt',
    'updatedAt',
  ]);
};
