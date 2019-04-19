export default value => {
  if (value >= 0 && value <= 12) {
    return value + 'am';
  }
  return value + 'pm';
};
