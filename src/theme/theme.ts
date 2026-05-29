// theme.js

const theme = {
  // ─── Color Palette ────────────────────────────────────────────────
  colors: {
    black: "#151515", // primary text, dark UI text
    darkGreen: "#082E34", // primary brand / sidebar / nav background
    orange: "#FF8B32", // primary CTA, active tabs, badges
    babyBlue: "#B4DBFF", // light buttons, secondary actions
    white: "#F7F6F3", // background, card surfaces, text on dark
    // Utility
    divider: "#D0D0D0", // separator lines
    overlay: "rgba(0,0,0,0.10)", // subtle borders / shadows
  },

  // ─── Typography ───────────────────────────────────────────────────
  typography: {
    fontFamily: "'Elza Text', sans-serif",

    // Header scale
    h3: {
      fontFamily: "'Elza Text', sans-serif",
      fontSize: "32px",
      fontWeight: 500, // Medium
      lineHeight: "100%",
      letterSpacing: "0%",
    },
    h4: {
      fontFamily: "'Elza Text', sans-serif",
      fontSize: "24px",
      fontWeight: 500,
      lineHeight: "100%",
      letterSpacing: "0%",
    },

    // Body scale
    body1: {
      fontFamily: "'Elza Text', sans-serif",
      fontSize: "16px",
      fontWeight: 400, // Regular
      lineHeight: "100%",
      letterSpacing: "0%",
    },
    body3: {
      fontFamily: "'Elza Text', sans-serif",
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "100%",
      letterSpacing: "0%",
    },
    body3Bold: {
      fontFamily: "'Elza Text', sans-serif",
      fontSize: "12px",
      fontWeight: 500, // Medium
      lineHeight: "100%",
      letterSpacing: "0%",
    },
  },

  // ─── Spacing ──────────────────────────────────────────────────────
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "30px",
    xxxl: "32px",
  },

  // ─── Border Radius ────────────────────────────────────────────────
  borderRadius: {
    frame: "2px", // outer frames / containers
    button: "5px", // buttons, badges, chips
    card: "10px", // plan cards, modals, panels
  },

  // ─── Component Tokens ─────────────────────────────────────────────
  components: {
    // Primary (Long / Big Dark) Button
    buttonPrimary: {
      background: "#FF8B32",
      color: "#082E34",
      borderRadius: "5px",
      padding: "12px 30px",
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "100%",
      height: "34px",
      gap: "10px",
    },

    // Dark Button (Extra Small / Small / Big Dark)
    buttonDark: {
      background: "#082E34",
      color: "#F7F6F3",
      borderRadius: "5px",
      padding: "12px 30px",
      fontSize: "12px",
      fontWeight: 500,
    },

    // Light / Outline Button
    buttonLight: {
      background: "#B4DBFF",
      color: "#082E34",
      borderRadius: "5px",
      padding: "12px 30px",
      fontSize: "12px",
      fontWeight: 500,
    },

    // Navigation / Menu Bar
    navbar: {
      background: "#082E34",
      activeTabBg: "#FF8B32",
      activeTabColor: "#082E34",
      inactiveTabColor: "#F7F6F3",
      height: "52px",
    },

    // Cards / Panels
    card: {
      background: "#F7F6F3",
      border: "1px solid #082E34",
      borderRadius: "10px",
    },

    // Status Badges
    badgePending: {
      background: "#FF8B32",
      color: "#082E34",
      borderRadius: "5px",
      fontSize: "12px",
      padding: "4px 8px",
    },
    badgePaid: {
      background: "#B4DBFF",
      color: "#082E34",
      borderRadius: "5px",
      fontSize: "12px",
      padding: "4px 8px",
    },
  },
};

export default theme;
