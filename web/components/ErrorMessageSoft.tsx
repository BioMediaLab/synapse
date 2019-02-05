const styles = {
  fontSize: 16,
  color: "red",
};

export default ({ error }) => {
  if (!error || !error.message) return null;
  else
    return (
      <span style={styles}>{error.message.replace("GraphQL error: ", "")}</span>
    );
};
