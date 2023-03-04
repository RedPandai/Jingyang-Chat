function ProgressBar({ percent }) {
  const styles = {
    progressBar: {
      height: "12px",
      borderRadius: "6px",
      backgroundColor: "#eee",
      overflow: "hidden",
    },
    progress: {
      height: "100%",
      backgroundColor: "#f7d36f",
      width: `${percent}%`,
      transition: "width 0.3s ease-in-out",
    },
  };

  return (
    <div style={styles.progressBar}>
      <div style={styles.progress}></div>
    </div>
  );
}

export default ProgressBar;
