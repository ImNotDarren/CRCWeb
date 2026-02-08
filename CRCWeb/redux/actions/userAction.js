export const update = (user) => {
  return {
    type: 'UPDATE_USER',
    value: user,
  };
}