// // import React, { useEffect, useState, useMemo } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { Document, Page, pdfjs } from "react-pdf";
// // import { getData } from "../../utils/storage";
// // // Worker setup
// // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // import { pdfjs } from "react-pdf";
// // import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// // pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
// // // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// // //   "pdfjs-dist/build/pdf.worker.min.mjs",
// // //   import.meta.url
// // // ).toString();

// // export default function PDFViewerScreen() {
// //   const navigate = useNavigate();
// //   const { state } = useLocation();
// //   // const data = state?.data;
// //   const data =
// //   state?.data ||
// //   JSON.parse(getData("selected_pdf") || "null");

// // const localPdfUrl  = useMemo(() => {
// //   if (!data) return null;
// //   console.log(data,'data');
// //   return (
// //     data.pdfFile?.localUrl ||
// //     data.pdfFile?.url ||
// //     null

// //   );

// // }, [data]);

// //   const [numPages, setNumPages] = useState(null);
// //   const [isRedirecting, setIsRedirecting] = useState(false);

// //   // 1. Generate path for local file
// //   // const localPdfUrl = useMemo(() => {
// //   //   if (!data?.title || !data?.id) return null;
// //   //   const sanitizedTitle = data.title.replace(/\//g, "-").replace(/\s+/g, "_");
// //   //   return `/pdfs/${sanitizedTitle}-${data.id}.pdf`;
// //   // }, [data?.title, data?.id]);

// //   // 2. Tab Title Update
// //   useEffect(() => {
// //     if (data?.title) document.title = data.title;
// //   }, [data?.title]);

// //   // 3. Auto-Redirect Logic
// //   // If we detect an error loading the embedded viewer, we open the direct link
// //   const handleLoadError = (err) => {
// //     console.error("Embedding blocked/failed, opening direct link:", err);
// //     if (data?.pdfFile?.url && !isRedirecting) {
// //       setIsRedirecting(true);
// //       // Opens the PDF directly in a new tab
// //       window.open(data.pdfFile.url, "_blank", "noreferrer");
// //     }
// //   };

// //   const onDocumentLoadSuccess = ({ numPages }) => {
// //     setNumPages(numPages);
// //   };

// //   return (
// //     <div style={styles.container}>
// //       {/* HEADER */}
// //       <header style={styles.header}>
// //         <button onClick={() => navigate(-1)} style={styles.backBtn}>
// //           ← Back
// //         </button>
// //         <h3 style={styles.title}>{data?.title || "PDF Viewer"}</h3>
// //       </header>

// //       {/* VIEWER AREA */}
// //       <div style={styles.pdfBox}>
// //         {isRedirecting ? (
// //           <div style={styles.message}>
// //             {/* <p>Security block detected.</p> */}
// //             <p><b>Opening direct PDF link in a new tab...</b></p>
// //             <button
// //               onClick={() => window.open(data?.pdfFile?.url, "_blank")}
// //               style={styles.downloadLink}
// //             >
// //               Click here if it didn't open
// //             </button>
// //           </div>
// //         ) : !localPdfUrl && !data?.pdfFile?.url ? (
// //           <p style={styles.message}>No PDF source found.</p>
// //         ) : (
// //           <Document
// //             file={localPdfUrl || data?.pdfFile?.url}
// //             onLoadSuccess={onDocumentLoadSuccess}
// //             onLoadError={handleLoadError}
// //             loading={<div style={styles.message}>Opening Document...</div>}
// //           >
// //             {Array.from(new Array(numPages), (el, index) => (
// //               <div key={`p_${index + 1}`} style={styles.pageWrapper}>
// //                 <Page
// //                   pageNumber={index + 1}
// //                   width={window.innerWidth > 768 ? 700 : window.innerWidth - 40}
// //                   renderAnnotationLayer={false}
// //                   renderTextLayer={false}
// //                 />
// //                 <p style={styles.pageLabel}>Page {index + 1} of {numPages}</p>
// //               </div>
// //             ))}
// //           </Document>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     padding: "16px",
// //     background: "#f6f7fb",
// //     minHeight: "100vh",
// //     fontFamily: "system-ui, sans-serif",
// //   },
// //   header: {
// //     display: "flex",
// //     alignItems: "center",
// //     marginBottom: "20px",
// //     gap: "12px",
// //   },
// //   backBtn: {
// //     padding: "8px 16px",
// //     border: "none",
// //     background: "#205072",
// //     color: "#fff",
// //     borderRadius: "6px",
// //     cursor: "pointer",
// //   },
// //   title: {
// //     fontSize: "18px",
// //     fontWeight: "600",
// //     color: "#205072",
// //     margin: 0,
// //   },
// //   pdfBox: {
// //     background: "#fff",
// //     padding: "10px",
// //     borderRadius: "12px",
// //     boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
// //     display: "flex",
// //     flexDirection: "column",
// //     alignItems: "center",
// //     minHeight: "300px",
// //     justifyContent: "center"
// //   },
// //   pageWrapper: {
// //     marginBottom: "25px",
// //     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
// //   },
// //   pageLabel: {
// //     textAlign: "center",
// //     fontSize: "12px",
// //     color: "#999",
// //     marginTop: "8px",
// //   },
// //   message: {
// //     padding: "50px",
// //     color: "#777",
// //     textAlign: "center"
// //   },
// //   downloadLink: {
// //     marginTop: "15px",
// //     padding: "10px 20px",
// //     background: "#205072",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "5px",
// //     cursor: "pointer",
// //     fontWeight: "500",
// //   },
// // };

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Document, Page, pdfjs } from "react-pdf";
// import { getData, setData } from "../../utils/storage";

// import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// // Cache PDF locally
// const cachePdf = async (url) => {
//   try {
//     const key = "pdf_" + url;

//     const cached = await getData(key);
//     if (cached) return cached;

//     const res = await fetch(url);
//     const blob = await res.blob();

//     const reader = new FileReader();

//     return new Promise((resolve) => {
//       reader.onloadend = () => {
//         const base64 = reader.result;
//         setData(key, base64);
//         resolve(base64);
//       };

//       reader.readAsDataURL(blob);
//     });
//   } catch (err) {
//     console.error("PDF cache failed:", err);
//     return null;
//   }
// };

// export default function PDFViewerScreen() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const data =
//     state?.data || JSON.parse(getData("selected_pdf") || "null");

//   const [numPages, setNumPages] = useState(null);
//   const [pdfSource, setPdfSource] = useState(null);
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   // Load PDF
//   useEffect(() => {
//     const loadPdf = async () => {
//       if (!data?.pdfFile?.url) return;

//       const key = "pdf_" + data.pdfFile.url;

//       const cached = localStorage.getItem(key);

//       if (cached) {
//         setPdfSource(cached);
//       } else {
//         const stored = await cachePdf(data.pdfFile.url);
//         setPdfSource(stored || data.pdfFile.url);
//       }
//     };

//     loadPdf();

//     if (data?.title) {
//       document.title = data.title;
//     }
//   }, [data]);

//   const handleLoadError = (err) => {
//     console.error("PDF load failed:", err);

//     if (data?.pdfFile?.url && !isRedirecting) {
//       setIsRedirecting(true);
//       window.open(data.pdfFile.url, "_blank", "noreferrer");
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   if (!pdfSource) {
//     return (
//       <div style={styles.message}>
//         Loading PDF...
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <button
//           onClick={() => navigate(-1)}
//           style={styles.backBtn}
//         >
//           ← Back
//         </button>

//         <h3 style={styles.title}>
//           {data?.title || "PDF Viewer"}
//         </h3>
//       </header>

//       <div style={styles.pdfBox}>
//         {isRedirecting ? (
//           <div style={styles.message}>
//             <p>
//               <b>Opening PDF in new tab...</b>
//             </p>

//             <button
//               onClick={() =>
//                 window.open(data?.pdfFile?.url, "_blank")
//               }
//               style={styles.downloadLink}
//             >
//               Click here if it didn't open
//             </button>
//           </div>
//         ) : (
//           <Document
//             file={pdfSource}
//             onLoadSuccess={onDocumentLoadSuccess}
//             onLoadError={handleLoadError}
//             loading={
//               <div style={styles.message}>
//                 Opening Document...
//               </div>
//             }
//           >
//             {Array.from(
//               new Array(numPages),
//               (_, index) => (
//                 <div
//                   key={`page_${index + 1}`}
//                   style={styles.pageWrapper}
//                 >
//                   <Page
//                     pageNumber={index + 1}
//                     width={
//                       window.innerWidth > 768
//                         ? 700
//                         : window.innerWidth - 40
//                     }
//                     renderAnnotationLayer={false}
//                     renderTextLayer={false}
//                   />

//                   <p style={styles.pageLabel}>
//                     Page {index + 1} of {numPages}
//                   </p>
//                 </div>
//               )
//             )}
//           </Document>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     padding: "16px",
//     background: "#f6f7fb",
//     minHeight: "100vh",
//     fontFamily: "system-ui, sans-serif",
//   },

//   header: {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "20px",
//     gap: "12px",
//   },

//   backBtn: {
//     padding: "8px 16px",
//     border: "none",
//     background: "#205072",
//     color: "#fff",
//     borderRadius: "6px",
//     cursor: "pointer",
//   },

//   title: {
//     fontSize: "18px",
//     fontWeight: "600",
//     color: "#205072",
//     margin: 0,
//   },

//   pdfBox: {
//     background: "#fff",
//     padding: "10px",
//     borderRadius: "12px",
//     boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     minHeight: "300px",
//     justifyContent: "center",
//   },

//   pageWrapper: {
//     marginBottom: "25px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//   },

//   pageLabel: {
//     textAlign: "center",
//     fontSize: "12px",
//     color: "#999",
//     marginTop: "8px",
//   },

//   message: {
//     padding: "50px",
//     color: "#777",
//     textAlign: "center",
//   },

//   downloadLink: {
//     marginTop: "15px",
//     padding: "10px 20px",
//     background: "#205072",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontWeight: "500",
//   },
// };

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { getData, setData } from "../../utils/storage"; // Using your existing localforage utils

// import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
// pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// This forces it to pull from the CDN, bypassing your PWA caching issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export default function PDFViewerScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state?.data || JSON.parse(getData("selected_pdf") || "null");

  const [numPages, setNumPages] = useState(null);
  const [pdfSource, setPdfSource] = useState(null);
  const [loading, setLoading] = useState(true);
  cosnt[(loadingg, setLoadingg)] = useState(true);
  useEffect(() => {
    const loadPdf = async () => {
      if (!data?.pdfFile?.url) return;

      try {
        // 1. Try to get the raw BLOB from localforage
        const cachedBlob = await getData(data.pdfFile.url);

        if (cachedBlob instanceof Blob) {
          // 2. Use the BLOB directly (Fast and efficient)
          setPdfSource(URL.createObjectURL(cachedBlob));
        } else {
          // 3. Fallback to the live URL
          setPdfSource(data.pdfFile.url);
        }
      } catch (err) {
        console.error("PDF load failed:", err);
        setPdfSource(data.pdfFile.url);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [data]);

  // Clean up memory
  useEffect(() => {
    return () => {
      if (pdfSource && pdfSource.startsWith("blob:")) {
        URL.revokeObjectURL(pdfSource);
      }
    };
  }, [pdfSource]);

  if (loading) return <div style={styles.message}>Opening Document...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
        <h3 style={styles.title}>{data?.title || "PDF Viewer"}</h3>
      </header>

      <div style={styles.pdfBox}>
        <Document
          file={pdfSource}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={() => window.open(data?.pdfFile?.url, "_blank")}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div key={`page_${index + 1}`} style={styles.pageWrapper}>
              <Page
                pageNumber={index + 1}
                width={window.innerWidth > 768 ? 700 : window.innerWidth - 40}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
              <p style={styles.pageLabel}>
                Page {index + 1} of {numPages}
              </p>
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
const styles = {
  container: {
    padding: "16px",
    background: "#f6f7fb",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
  },

  backBtn: {
    padding: "8px 16px",
    border: "none",
    background: "#205072",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#205072",
    margin: 0,
  },

  pdfBox: {
    background: "#fff",
    padding: "10px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "300px",
    justifyContent: "center",
  },

  pageWrapper: {
    marginBottom: "25px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  pageLabel: {
    textAlign: "center",
    fontSize: "12px",
    color: "#999",
    marginTop: "8px",
  },

  message: {
    padding: "50px",
    color: "#777",
    textAlign: "center",
  },

  downloadLink: {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#205072",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "500",
  },
};
