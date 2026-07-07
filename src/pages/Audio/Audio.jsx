// // import React, { useState } from "react";
// // // IMPORTANT: Adjust this path to wherever your data file is located
// // // import guidelines, { myGuidelines } from "../Guidelines/Guidelines";
// // // IMPORTANT: Adjust this path to wherever you saved the audio card component
// // import OfflineAudioCard from "./OfflineAudioCard";

// // const Audio = () => {
// //   // State to manage the active language (defaults to english)
// //   const [language, setLanguage] = useState("english");

// //   // Choose the correct array based on the selected language
// //   const currentData = language === "english" ? guidelines : myGuidelines;

// //   const toggleLanguage = () => {
// //     setLanguage((prev) => (prev === "english" ? "burmese" : "english"));
// //   };

// //   return (
// //     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
// //       {/* Header and Language Toggle */}
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           marginBottom: "24px",
// //           flexWrap: "wrap",
// //           gap: "10px",
// //         }}
// //       >
// //         <h2 style={{ margin: 0 }}>
// //           {language === "english"
// //             ? "Medical Audio Guidelines"
// //             : "ဆေးဘက်ဆိုင်ရာ အသံလမ်းညွှန်ချက်များ"}
// //         </h2>

// //         <button
// //           onClick={toggleLanguage}
// //           style={{
// //             padding: "8px 16px",
// //             backgroundColor: "#007bff",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "6px",
// //             cursor: "pointer",
// //             fontWeight: "bold",
// //           }}
// //         >
// //           Switch to {language === "english" ? "မြန်မာ" : "English"}
// //         </button>
// //       </div>

// //       {/* Render the Audio Cards */}
// //       <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
// //         {currentData.map((item) => (
// //           <OfflineAudioCard key={item.id} item={item} />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Audio;

// import React, { useState, useRef } from "react";
// // Note: You would use a CSS-based modal for the web, like react-modal or a custom div

// const WebAudioModal = ({ isVisible, closeModal, data }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null); // This gives us direct access to the actual audio engine

//   // If modal is closed, return nothing
//   if (!isVisible || !data) return null;

//   const togglePlayPause = () => {
//     if (isPlaying) {
//       audioRef.current.pause(); // Pause the actual audio
//       setIsPlaying(false);
//     } else {
//       audioRef.current.play(); // Play the actual audio
//       setIsPlaying(true);
//     }
//   };

//   const handleClose = () => {
//     audioRef.current.pause(); // Stop audio when closing
//     setIsPlaying(false);
//     closeModal();
//   };

//   return (
//     <div style={styles.modalOverlay}>
//       <div style={styles.modalContent}>
//         {/* The Image & Play Button Area */}
//         <div
//           style={{ backgroundImage: `url(${data.img})`, ...styles.imageHeader }}
//           onClick={togglePlayPause}
//         >
//           {/* Custom Play/Pause Icon */}
//           <button style={styles.playButton}>
//             {isPlaying ? "⏸ Pause" : "▶ Play"}
//           </button>
//         </div>

//         {/* Text Area */}
//         <div style={{ padding: "20px" }}>
//           <h2>{data.title}</h2>
//           <p>{data.description}</p>
//         </div>

//         {/*
//           THIS IS THE ACTUAL AUDIO
//           It is hidden from the screen, but we control it with the button above
//         */}
//         <audio
//           ref={audioRef}
//           src={data.url}
//           onEnded={() => setIsPlaying(false)} // Reset button when song ends
//         />

//         <button onClick={handleClose} style={styles.closeButton}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// // Quick inline styles for the example
// const styles = {
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderRadius: "10px",
//     width: "90%",
//     maxWidth: "400px",
//     overflow: "hidden",
//   },
//   imageHeader: {
//     height: "150px",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//   },
//   playButton: {
//     padding: "10px 20px",
//     fontSize: "16px",
//     borderRadius: "20px",
//     border: "none",
//     backgroundColor: "#007bff",
//     color: "white",
//     cursor: "pointer",
//   },
//   closeButton: {
//     margin: "0 20px 20px",
//     padding: "10px",
//     width: "calc(100% - 40px)",
//     backgroundColor: "#dc3545",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//   },
// };

// export default WebAudioModal;
