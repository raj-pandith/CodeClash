// src/style/homePageStyles.js
  const bgUrl = "https://img.freepik.com/premium-photo/creative-dark-binary-code-wallpaper-with-numbers-technology-computing-concept-3d-rendering_670147-53906.jpg"; // backend URL

export const getStyles = (isMobile) => ({
  container: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "85vh",
    padding: isMobile ? "5%" : "0 10%",
    backgroundColor: "#0d0d0d",
    color: "#f5f5f5",
    fontFamily: "Poppins, sans-serif",
    gap: isMobile ? "30px" : "0",
       
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: "cover",       
    backgroundPosition: "center",  
    backgroundRepeat: "no-repeat"

  },

  boxBase: {
    flex: "1",
    textAlign: "center",
    padding: "40px",
    borderRadius: "15px",
    backgroundColor: "#1a1a1a",
    width: isMobile ? "100%" : "45%",
  },

  createBox: {
    border: "2px solid #00ffff",
    boxShadow: "0 0 15px #00ffff88",
    marginRight: isMobile ? "0" : "30px",
  },

  joinBox: {
    border: "2px solid #ff007f",
    boxShadow: "0 0 15px #ff007f88",
    marginLeft: isMobile ? "0" : "30px",
  },

  inputBase: {
    display: "block",
    width: "95%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "#111",
    color: "#fff",
    outline: "none",
    transition: "0.3s",
  },

  createInput: {
    border: "1px solid #00ffff",
  },

  joinInput: {
    border: "1px solid #ff007f",
  },

  createButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#00ffff",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },

  joinButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff007f",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },

  errorText: {
    position: "absolute",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#ff3333",
    fontWeight: "bold",
    textShadow: "0 0 10px red",
  },
});
