const styles = {
  fontSize: 16,
  color: "red",
};

export default ({ message }) => {
  if (!message) return null;
  else return <span style={styles}>{message}</span>;
};
