const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        padding: "1rem",
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      &copy; {new Date().getFullYear()} CuePoint. All rights reserved.
    </footer>
  );
};

export default Footer;
