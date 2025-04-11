

export const isAdmin = (role) => {
  return ['Admin', 'SuperAdmin'].includes(role);
};

export const canEdit = (user) => {
  return user.role === 'SuperAdmin' || user.permissions.includes('edit');
};

export const oppositeUser = (role) => {
  return role === 'user1' ? 'user2' : 'user1';
};

export const getCurrentPair = (user) => {
  if (!user || !user.paired || !Array.isArray(user.paired)) {
    return null;
  }

  for (let i = 0; i < user.paired.length; i++) {
    const paired = user.paired[i];
    if (paired.user1 === null && paired.user1Status === "Confirmed") {
      return {
        ...paired.user2,
        role: 'user2',
        status: paired.user2Status,
      };
    } else if (paired.user2 === null && paired.user2Status === "Confirmed") {
      return {
        ...paired.user1,
        role: 'user1',
        status: paired.user1Status,
      };
    }
  }

  return null;
};

export const getPendingPairs = (user) => {
  if (!user || !user.paired || !Array.isArray(user.paired)) {
    return [];
  }

  return user.paired.filter(p => (p.user1Status === "Pending" && p.user1 === null) || (p.user2Status === "Pending" && p.user2 === null));
}