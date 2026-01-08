/**
 * Footer component
 *
 * Simple sticky-friendly footer for the application layout.
 *
 * Responsibilities:
 * - Display a consistent footer bar at the bottom of the page
 * - Show the current year dynamically
 *
 * Notes:
 * - `marginTop: "auto"` works well when the parent layout uses a flex column
 *   container (e.g., `min-height: 100vh; display: flex; flex-direction: column;`),
 *   pushing the footer to the bottom when content is short.
 */
const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        padding: "1rem",
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        marginTop: "auto", // Pushes the footer to the bottom in a flex column layout
      }}
    >
      {/* Keep the year current without manual updates */}
      &copy; {new Date().getFullYear()} CuePoint. All rights reserved.
    </footer>
  );
};

export default Footer;
