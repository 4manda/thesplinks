export function resetState() {
  return { type: 'RESET_STATE' };
}

export function updateOnlineState(isOnline) {
  return {
    type: 'SET_ONLINE_STATE',
    isOnline,
  };
}
