// import React, { useState } from "react";
// // 1. Import your data (adjust the path to match your folder structure)
// import guidelines, { myGuidelines } from "../data/guidelines";
// // 2. Import the Web Modal we built in the previous step
// import WebAudioModal from "./WebAudioModal";

// const AudioListPage = () => {
//   // State for language toggle
//   const [isBurmese, setIsBurmese] = useState(false);

//   // State to track which audio file is currently selected for the modal
//   const [selectedTrack, setSelectedTrack] = useState(null);

//   // Switch data source based on language state
//   const currentData = isBurmese ? myGuidelines : guidelines;

//   return (
//     <div style={styles.container}>
//       {/* --- HEADER --- */}
//       <div style={styles.header}>
//         <h1 style={styles.title}>
//           {isBurmese
//             ? "ဆေးဘက်ဆိုင်ရာ အသံလမ်းညွှန်ချက်များ"
//             : "Medical Audio Guidelines"}
//         </h1>
//         <button
//           style={styles.langButton}
//           onClick={() => setIsBurmese(!isBurmese)}
//         >
//           {isBurmese ? "Switch to English" : "မြန်မာဘာသာသို့ ပြောင်းမည်"}
//         </button>
//       </div>

//       {/* --- AUDIO LIST --- */}
//       <div style={styles.listContainer}>
//         {currentData.map((item) => (
//           <div
//             key={item.id}
//             style={styles.card}
//             onClick={() => setSelectedTrack(item)} // Opens the modal with this item
//           >
//             {/* Image Thumbnail */}
//             <img src={item.img} alt={item.title} style={styles.thumbnail} />

//             {/* Text Content */}
//             <div style={styles.textContainer}>
//               <h2 style={styles.cardTitle}>{item.title}</h2>
//               <p style={styles.cardDescription}>
//                 {/* Truncate long descriptions so the list stays neat */}
//                 {item.description.length > 80
//                   ? `${item.description.substring(0, 80)}...`
//                   : item.description}
//               </p>
//             </div>

//             {/* Play Button Indicator */}
//             <div style={styles.playIconContainer}>
//               <span style={styles.playIcon}>▶</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* --- POP-UP MODAL --- */}
//       {/* This renders on top of the list when an item is selected */}
//       <WebAudioModal
//         isVisible={!!selectedTrack}
//         data={selectedTrack}
//         closeModal={() => setSelectedTrack(null)}
//       />
//     </div>
//   );
// };

// // --- STYLES ---
// const styles = {
//   container: {
//     maxWidth: "800px",
//     margin: "0 auto",
//     padding: "20px",
//     fontFamily: "system-ui, -apple-system, sans-serif",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "24px",
//     flexWrap: "wrap",
//     gap: "12px",
//   },
//   title: {
//     margin: 0,
//     fontSize: "24px",
//     color: "#333",
//   },
//   langButton: {
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     padding: "10px 16px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
//   listContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   },
//   card: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     border: "1px solid #e0e0e0",
//     borderRadius: "10px",
//     padding: "12px",
//     cursor: "pointer",
//     transition: "transform 0.2s, box-shadow 0.2s",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//   },
//   thumbnail: {
//     width: "70px",
//     height: "70px",
//     borderRadius: "8px",
//     objectFit: "cover",
//     marginRight: "16px",
//     backgroundColor: "#f0f0f0", // Fallback color while image loads
//   },
//   textContainer: {
//     flex: 1, // Takes up remaining space
//   },
//   cardTitle: {
//     margin: "0 0 4px 0",
//     fontSize: "18px",
//     color: "#222",
//   },
//   cardDescription: {
//     margin: 0,
//     fontSize: "14px",
//     color: "#666",
//     lineHeight: "1.4",
//   },
//   playIconContainer: {
//     padding: "0 10px",
//   },
//   playIcon: {
//     fontSize: "24px",
//     color: "#007bff",
//   },
// };

// export default AudioListPage;
