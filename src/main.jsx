// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { registerSW } from "virtual:pwa-register";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";

// registerSW({ immediate: true });

// createRoot(document.getElementById('root')).render(
//   <StrictMode  basename="/nepas-web">
//     <App />
//   </StrictMode>,
// )


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

registerSW({ immediate: true });

//   dynamic base name
const getBaseName = () => {
 const path = window.location.pathname;
  // This looks at the URL (e.g., /CollectorWeb/dashboard)
  // and extracts the first folder name ("CollectorWeb")
  const segments = path.split('/').filter(Boolean);
  
  // Check if we are in a subfolder or at the root
  // We use [0] because CollectorWeb is the first segment
  return segments.length > 0 ? `/${segments[0]}` : "";
};


// const getBaseName = () => {
//   const path = window.location.pathname;

//   // define all possible base paths your app can run under
//   const knownBases = ["/Nepas-Web"];

//   const match = knownBases.find((base) =>
//     path.startsWith(base)
//   );

//   return match || "/";
// };

const baseName = getBaseName();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={baseName}>
      <App />
    </BrowserRouter>
  </StrictMode>
);