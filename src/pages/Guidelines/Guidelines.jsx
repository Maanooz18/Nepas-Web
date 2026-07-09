// import React, { useEffect, useMemo, useState } from "react";
// import moment from "moment";
// import { fetchGuidelinesApi } from "../../services/guidelines.services";
// import GuidelinesList from "./Guidelines.list";
// import { getData, setData, getAllKeys } from "../../utils/storage";
// import { downloadAndCachePdf } from "../../components/PDFViewer/offlinePdfService";

// export default function GuidelinesScreen() {
//   const [guidelines, setGuidelines] = useState([]);
//   const [tabIndex, setTabIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [search, setSearch] = useState("");
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   // States for bulk download
//   const [isDownloadingAll, setIsDownloadingAll] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     loadData();

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   const loadData = async () => {
//     const stored = await getData("guidelines");
//     const storedSyncTime = await getData("guidelines_sync_time");

//     if (storedSyncTime) {
//       setLastUpdated(storedSyncTime);
//     }

//     if (stored && stored.length) {
//       setGuidelines(stored);
//       if (navigator.onLine) {
//         syncFromApi(false);
//       }
//     } else {
//       if (navigator.onLine) {
//         syncFromApi(true);
//       } else {
//         setGuidelines([]);
//       }
//     }
//   };

//   const syncFromApi = (showLoader = true) => {
//     if (showLoader) setLoading(true);

//     fetchGuidelinesApi({
//       successCallback: (data) => {
//         const result = data || [];
//         setGuidelines(result);
//         setData("guidelines", result);

//         const timestamp = moment().format("YYYY-MM-DD hh:mm A");
//         setData("guidelines_sync_time", timestamp);
//         setLastUpdated(timestamp);
//       },
//       finalCallback: () => {
//         setLoading(false);
//       },
//       errorCallback: () => {
//         setLoading(false);
//       },
//     });
//   };

//   const handleRefresh = () => {
//     if (isOnline) {
//       syncFromApi(true);
//     } else {
//       alert("You are currently offline. Cannot sync right now.");
//     }
//   };

//   // --- NEW BULK DOWNLOAD LOGIC ---
//   const handleDownloadAll = async () => {
//     if (!isOnline) {
//       alert("You must be online to download PDFs.");
//       return;
//     }

//     // 1. Gather all PDF URLs from all categories
//     let allUrls = [];
//     guidelines.forEach((category) => {
//       category?.guidelines?.forEach((item) => {
//         if (item?.pdfFile?.url) {
//           allUrls.push(item.pdfFile.url);
//         }
//       });
//     });

//     // Remove duplicates just in case
//     allUrls = [...new Set(allUrls)];

//     if (allUrls.length === 0) {
//       alert("No PDFs found to download.");
//       return;
//     }

//     setIsDownloadingAll(true);
//     setDownloadProgress({ current: 0, total: allUrls.length });

//     // 2. Fetch existing IndexedDB keys to skip already downloaded files
//     const existingKeys = (await getAllKeys()) || [];

//     let count = 0;
//     for (const url of allUrls) {
//       // If not already downloaded, fetch and cache it
//       if (!existingKeys.includes(url)) {
//         try {
//           await downloadAndCachePdf(url);
//         } catch (error) {
//           console.error(`Failed to download ${url}:`, error);
//           // We continue to the next one even if one fails
//         }
//       }
//       count++;
//       setDownloadProgress({ current: count, total: allUrls.length });
//     }

//     setIsDownloadingAll(false);
//     setDownloadProgress(null);
//     setRefreshTrigger((prev) => prev + 1); // Tell the list component to re-check local storage
//     alert("Bulk download complete!");
//   };

//   if (loading) {
//     return <div style={{ padding: 20 }}>Loading...</div>;
//   }

//   const filteredGuidelines = useMemo(() => {
//     const current = guidelines[tabIndex]?.guidelines || [];

//     if (!search.trim()) return current;

//     const q = search.toLowerCase();

//     return current.filter((item) =>
//       JSON.stringify(item).toLowerCase().includes(q),
//     );
//   }, [guidelines, tabIndex, search]);

//   return (
//     <div className="guidelines-page">
//       <style>{css}</style>

//       {/* HEADER */}
//       <div
//         className="header"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h2 className="title">Guidelines</h2>
//         <div
//           style={{
//             fontSize: "12px",
//             fontWeight: "bold",
//             color: isOnline ? "green" : "red",
//           }}
//         >
//           {isOnline ? "● Online" : "● Offline"}
//         </div>
//       </div>

//       <div className="searchBox">
//         <input
//           placeholder="Search Guidelines..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* TABS */}
//       <div className="tab-container">
//         {guidelines.map((item, i) => (
//           <div
//             key={i}
//             className={`tab ${tabIndex === i ? "active" : ""}`}
//             onClick={() => setTabIndex(i)}
//           >
//             {item?.title}
//           </div>
//         ))}
//       </div>

//       <div className="guidelines-content">
//         {guidelines.length > 0 ? (
//           <GuidelinesList
//             data={filteredGuidelines}
//             refreshTrigger={refreshTrigger}
//           />
//         ) : (
//           <p>No guidelines available.</p>
//         )}
//       </div>

//       {/* FOOTER */}
//       <div className="footer">
//         <span style={{ marginBottom: "10px" }}>
//           Last synced: {lastUpdated || "Never"}
//         </span>

//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             flexWrap: "wrap",
//             width: "100%",
//           }}
//         >
//           <button
//             onClick={handleRefresh}
//             className="btn refreshBtn"
//             disabled={!isOnline}
//           >
//             Sync List
//           </button>

//           <button
//             onClick={handleDownloadAll}
//             className="btn downloadAllBtn"
//             disabled={!isOnline || isDownloadingAll}
//           >
//             {isDownloadingAll
//               ? `Downloading ${downloadProgress?.current} / ${downloadProgress?.total}...`
//               : "Download All PDFs"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const css = `
// * {
//   box-sizing: border-box;
//   max-width: 100%;
// }

// body {
//   margin: 0;
//   overflow-x: hidden;
// }

// .guidelines-page {
//   min-height: 100vh;
//   background: #f6f7fb;
//   padding: 12px 16px;
//   font-family: Arial;
//   overflow-x: hidden;
// }

// .title {
//   color: #205072;
//   margin: 0;
//   font-size: clamp(18px, 2.5vw, 24px);
// }

// .tab-container {
//   display: flex;
//   overflow-x: auto;
//   gap: 10px;
//   border-bottom: 1px solid #ddd;
//   padding-bottom: 6px;
//   margin-top: 10px;
// }

// .tab {
//   padding: 8px 12px;
//   white-space: nowrap;
//   flex-shrink: 0;
//   cursor: pointer;
//   font-size: 14px;
// }

// .tab.active {
//   border-bottom: 2px solid #205072;
//   color: #205072;
//   font-weight: 600;
// }

// .guidelines-content {
//   margin-top: 15px;
//   padding-bottom: 100px;
//   width: 100%;
//   overflow-x: hidden;
// }

// .guidelines-content * {
//   max-width: 100%;
//   word-break: break-word;
//   overflow-wrap: anywhere;
// }

// .guidelines-content img,
// .guidelines-content table {
//   max-width: 100%;
//   width: 100%;
//   display: block;
// }

// .footer {
//   margin-top: 20px;
//   display: flex;
//   flex-direction: column;
//   font-size: 12px;
//   color: gray;
// }

// .btn {
//   padding: 10px 14px;
//   border: none;
//   border-radius: 6px;
//   cursor: pointer;
//   font-weight: bold;
//   flex: 1;
// }

// .refreshBtn {
//   background: #205072;
//   color: white;
// }

// .refreshBtn:disabled {
//   background: #999;
//   cursor: not-allowed;
// }

// .downloadAllBtn {
//   background: #28a745;
//   color: white;
// }

// .downloadAllBtn:disabled {
//   background: #77c688;
//   cursor: not-allowed;
// }

// .searchBox input {
//   width: 100%;
//   padding: 12px;
//   border-radius: 12px;
//   border: 1px solid #ddd;
//   font-size: 14px;
//   outline: none;
//   margin-top: 12px;
// }
// `;

// import React, { useEffect, useMemo, useState } from "react";
// import moment from "moment";
// import { fetchGuidelinesApi } from "../../services/guidelines.services";
// import GuidelinesList from "./Guidelines.list";
// import { getData, setData, getAllKeys } from "../../utils/storage";
// import { downloadAndCachePdf } from "../../components/PDFViewer/offlinePdfService";

// export default function GuidelinesScreen() {
//   const [guidelines, setGuidelines] = useState([]);
//   const [tabIndex, setTabIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [search, setSearch] = useState("");
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   // States for bulk download
//   const [isDownloadingAll, setIsDownloadingAll] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     loadData();

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   const loadData = async () => {
//     const stored = await getData("guidelines");
//     const storedSyncTime = await getData("guidelines_sync_time");

//     if (storedSyncTime) {
//       setLastUpdated(storedSyncTime);
//     }

//     if (stored && stored.length) {
//       setGuidelines(stored);
//       if (navigator.onLine) {
//         syncFromApi(false);
//       }
//     } else {
//       if (navigator.onLine) {
//         syncFromApi(true);
//       } else {
//         setGuidelines([]);
//       }
//     }
//   };

//   const syncFromApi = (showLoader = true) => {
//     if (showLoader) setLoading(true);

//     fetchGuidelinesApi({
//       successCallback: (data) => {
//         const result = data || [];
//         setGuidelines(result);
//         setData("guidelines", result);

//         const timestamp = moment().format("YYYY-MM-DD hh:mm A");
//         setData("guidelines_sync_time", timestamp);
//         setLastUpdated(timestamp);
//       },
//       finalCallback: () => {
//         setLoading(false);
//       },
//       errorCallback: () => {
//         setLoading(false);
//       },
//     });
//   };

//   const handleRefresh = () => {
//     if (isOnline) {
//       syncFromApi(true);
//     } else {
//       alert("You are currently offline. Cannot sync right now.");
//     }
//   };

//   const handleDownloadAll = async () => {
//     if (!isOnline) {
//       alert("You must be online to download PDFs.");
//       return;
//     }

//     let allUrls = [];
//     guidelines.forEach((category) => {
//       category?.guidelines?.forEach((item) => {
//         if (item?.pdfFile?.url) {
//           allUrls.push(item.pdfFile.url);
//         }
//       });
//     });

//     allUrls = [...new Set(allUrls)];

//     if (allUrls.length === 0) {
//       alert("No PDFs found to download.");
//       return;
//     }

//     setIsDownloadingAll(true);
//     setDownloadProgress({ current: 0, total: allUrls.length });

//     const existingKeys = (await getAllKeys()) || [];

//     let count = 0;
//     for (const url of allUrls) {
//       if (!existingKeys.includes(url)) {
//         try {
//           await downloadAndCachePdf(url);
//         } catch (error) {
//           console.error(`Failed to download ${url}:`, error);
//         }
//       }
//       count++;
//       setDownloadProgress({ current: count, total: allUrls.length });
//     }

//     setIsDownloadingAll(false);
//     setDownloadProgress(null);
//     setRefreshTrigger((prev) => prev + 1);
//     alert("Bulk download complete!");
//   };

//   if (loading) {
//     return <div style={{ padding: 20 }}>Loading...</div>;
//   }

//   // --- NEW: Flatten guidelines for the Offline tab ---
//   const allGuidelines = useMemo(() => {
//     return guidelines.reduce(
//       (acc, curr) => [...acc, ...(curr.guidelines || [])],
//       [],
//     );
//   }, [guidelines]);

//   // --- NEW: Filter by selected tab (including downloads) ---
//   const filteredGuidelines = useMemo(() => {
//     let current =
//       tabIndex === "downloads"
//         ? allGuidelines
//         : guidelines[tabIndex]?.guidelines || [];

//     if (!search.trim()) return current;

//     const q = search.toLowerCase();
//     return current.filter((item) =>
//       JSON.stringify(item).toLowerCase().includes(q),
//     );
//   }, [guidelines, tabIndex, search, allGuidelines]);

//   return (
//     <div className="guidelines-page">
//       <style>{css}</style>

//       {/* HEADER */}
//       <div
//         className="header"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h2 className="title">Guidelines</h2>
//         <div
//           style={{
//             fontSize: "12px",
//             fontWeight: "bold",
//             color: isOnline ? "green" : "red",
//           }}
//         >
//           {isOnline ? "● Online" : "● Offline"}
//         </div>
//       </div>

//       <div className="searchBox">
//         <input
//           placeholder="Search Guidelines..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* TABS */}
//       <div className="tab-container">
//         {guidelines.map((item, i) => (
//           <div
//             key={i}
//             className={`tab ${tabIndex === i ? "active" : ""}`}
//             onClick={() => setTabIndex(i)}
//           >
//             {item?.title}
//           </div>
//         ))}

//         {/* --- NEW: The Offline Downloads Tab --- */}
//         <div
//           className={`tab offline-tab ${tabIndex === "downloads" ? "active-offline" : ""}`}
//           onClick={() => setTabIndex("downloads")}
//         >
//           ⬇ Offline Downloads
//         </div>
//       </div>

//       <div className="guidelines-content">
//         {guidelines.length > 0 ? (
//           <GuidelinesList
//             data={filteredGuidelines}
//             refreshTrigger={refreshTrigger}
//             showOnlyDownloaded={tabIndex === "downloads"} // Passes this to list
//           />
//         ) : (
//           <p>No guidelines available.</p>
//         )}
//       </div>

//       {/* FOOTER */}
//       <div className="footer">
//         <span style={{ marginBottom: "10px" }}>
//           Last synced: {lastUpdated || "Never"}
//         </span>

//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             flexWrap: "wrap",
//             width: "100%",
//           }}
//         >
//           <button
//             onClick={handleRefresh}
//             className="btn refreshBtn"
//             disabled={!isOnline}
//           >
//             Sync List
//           </button>

//           <button
//             onClick={handleDownloadAll}
//             className="btn downloadAllBtn"
//             disabled={!isOnline || isDownloadingAll}
//           >
//             {isDownloadingAll
//               ? `Downloading..... ${downloadProgress?.current} / ${downloadProgress?.total}...`
//               : "Download All PDFs"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const css = `
// * {
//   box-sizing: border-box;
//   max-width: 100%;
// }

// body {
//   margin: 0;
//   overflow-x: hidden;
// }

// .guidelines-page {
//   min-height: 100vh;
//   background: #f6f7fb;
//   padding: 12px 16px;
//   font-family: Arial;
//   overflow-x: hidden;
// }

// .title {
//   color: #205072;
//   margin: 0;
//   font-size: clamp(18px, 2.5vw, 24px);
// }

// .tab-container {
//   display: flex;
//   overflow-x: auto;
//   gap: 10px;
//   border-bottom: 1px solid #ddd;
//   padding-bottom: 6px;
//   margin-top: 10px;
// }

// .tab {
//   padding: 8px 12px;
//   white-space: nowrap;
//   flex-shrink: 0;
//   cursor: pointer;
//   font-size: 14px;
// }

// .tab.active {
//   border-bottom: 2px solid #205072;
//   color: #205072;
//   font-weight: 600;
// }

// /* NEW: Styles for the offline tab */
// .offline-tab {
//   font-weight: bold;
//   color: #555;
//   border-left: 2px solid #ddd;
//   margin-left: 5px;
//   padding-left: 15px;
// }

// .offline-tab.active-offline {
//   border-bottom: 2px solid #28a745;
//   color: #28a745;
// }

// .guidelines-content {
//   margin-top: 15px;
//   padding-bottom: 100px;
//   width: 100%;
//   overflow-x: hidden;
// }

// .guidelines-content * {
//   max-width: 100%;
//   word-break: break-word;
//   overflow-wrap: anywhere;
// }

// .guidelines-content img,
// .guidelines-content table {
//   max-width: 100%;
//   width: 100%;
//   display: block;
// }

// .footer {
//   margin-top: 20px;
//   display: flex;
//   flex-direction: column;
//   font-size: 12px;
//   color: gray;
// }

// .btn {
//   padding: 10px 14px;
//   border: none;
//   border-radius: 6px;
//   cursor: pointer;
//   font-weight: bold;
//   flex: 1;
// }

// .refreshBtn {
//   background: #205072;
//   color: white;
// }

// .refreshBtn:disabled {
//   background: #999;
//   cursor: not-allowed;
// }

// .downloadAllBtn {
//   background: #28a745;
//   color: white;
// }

// .downloadAllBtn:disabled {
//   background: #77c688;
//   cursor: not-allowed;
// }

// .searchBox input {
//   width: 100%;
//   padding: 12px;
//   border-radius: 12px;
//   border: 1px solid #ddd;
//   font-size: 14px;
//   outline: none;
//   margin-top: 12px;
// }
// `;

import { useEffect, useState } from "react";
import localforage from "localforage";
import { getGuidelines } from "../../services/guidelines.services";

export default function GuidelinesScreen() {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloaded, setDownloaded] = useState({});

  // NEW: State to manage tabs ('all' or 'offline')
  const [activeTab, setActiveTab] = useState("all");

  // NEW: State to track "Download All" progress
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  useEffect(() => {
    loadGuidelines();
  }, []);

  async function loadGuidelines() {
    try {
      const data = await getGuidelines();
      setGuidelines(data);

      const status = {};
      for (const item of data) {
        const audio = await localforage.getItem(`audio-${item.id}`);
        const pdf = await localforage.getItem(`pdf-${item.id}`);
        status[item.id] = !!audio && !!pdf;
      }
      setDownloaded(status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // CORE LOGIC: Fetches and saves a single item
  async function fetchAndCacheItem(item) {
    const audioResponse = await fetch(item.audioUrl);
    const pdfResponse = await fetch(item.pdfUrl);

    if (!audioResponse.ok || !pdfResponse.ok) {
      throw new Error(`Failed to fetch resources for ${item.title}`);
    }

    const audioBlob = await audioResponse.blob();
    const pdfBlob = await pdfResponse.blob();

    await localforage.setItem(`audio-${item.id}`, audioBlob);
    await localforage.setItem(`pdf-${item.id}`, pdfBlob);
  }

  // Downloads a single clicked item
  async function downloadGuideline(item) {
    try {
      await fetchAndCacheItem(item);

      setDownloaded((prev) => ({
        ...prev,
        [item.id]: true,
      }));
      alert(`${item.title} downloaded successfully`);
    } catch (e) {
      console.error(e);
      alert(
        `Download failed for ${item.title}. Check your network or CORS limits.`,
      );
    }
  }

  // NEW: Downloads all items that are not yet downloaded
  async function downloadAll() {
    const itemsToDownload = guidelines.filter((item) => !downloaded[item.id]);

    if (itemsToDownload.length === 0) {
      alert("All guidelines are already downloaded!");
      return;
    }

    setIsDownloadingAll(true);
    let successCount = 0;

    // Loop sequentially to prevent crashing the browser with too many concurrent network requests
    for (const item of itemsToDownload) {
      try {
        await fetchAndCacheItem(item);
        setDownloaded((prev) => ({
          ...prev,
          [item.id]: true,
        }));
        successCount++;
      } catch (error) {
        console.error(`Skipped ${item.title} due to an error:`, error);
      }
    }

    setIsDownloadingAll(false);
    alert(
      `Successfully downloaded ${successCount} out of ${itemsToDownload.length} items.`,
    );
  }

  // NEW: Delete an offline item
  async function deleteOfflineGuideline(item) {
    await localforage.removeItem(`audio-${item.id}`);
    await localforage.removeItem(`pdf-${item.id}`);

    setDownloaded((prev) => ({
      ...prev,
      [item.id]: false,
    }));
  }

  async function playAudio(item) {
    const blob = await localforage.getItem(`audio-${item.id}`);
    let url = item.audioUrl;

    if (blob) {
      url = URL.createObjectURL(blob);
    }

    const audio = new Audio(url);
    audio.play();
  }

  async function openPdf(item) {
    const blob = await localforage.getItem(`pdf-${item.id}`);

    if (blob) {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      window.open(item.pdfUrl, "_blank");
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Loading guidelines...</p>;

  // Filter the list based on which tab is active
  const displayedGuidelines =
    activeTab === "offline"
      ? guidelines.filter((item) => downloaded[item.id])
      : guidelines;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER & TABS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setActiveTab("all")}
            style={{
              padding: "10px 16px",
              backgroundColor: activeTab === "all" ? "#007bff" : "#e0e0e0",
              color: activeTab === "all" ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            All Guidelines
          </button>

          <button
            onClick={() => setActiveTab("offline")}
            style={{
              padding: "10px 16px",
              backgroundColor: activeTab === "offline" ? "#28a745" : "#e0e0e0",
              color: activeTab === "offline" ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Offline Downloads
          </button>
        </div>

        {/* DOWNLOAD ALL BUTTON (Only show on 'All' tab) */}
        {activeTab === "all" && (
          <button
            onClick={downloadAll}
            disabled={isDownloadingAll}
            style={{
              padding: "10px 16px",
              backgroundColor: isDownloadingAll ? "#ccc" : "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isDownloadingAll ? "not-allowed" : "pointer",
            }}
          >
            {isDownloadingAll ? "Downloading All..." : "Download All Offline"}
          </button>
        )}
      </div>

      {/* EMPTY STATE FOR OFFLINE TAB */}
      {activeTab === "offline" && displayedGuidelines.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            border: "1px dashed #ccc",
            borderRadius: "8px",
          }}
        >
          <p>You haven't downloaded any guidelines for offline use yet.</p>
        </div>
      )}

      {/* LIST OF GUIDELINES */}
      {displayedGuidelines.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>{item.title}</h3>
          <p style={{ margin: "0 0 15px 0", color: "#555" }}>
            {item.description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {/* Status Indicator */}
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                backgroundColor: downloaded[item.id] ? "#d4edda" : "#f8d7da",
                color: downloaded[item.id] ? "#155724" : "#721c24",
                fontWeight: "bold",
              }}
            >
              {downloaded[item.id] ? "✅ Available Offline" : "☁️ Online Only"}
            </span>

            {/* Actions */}
            {!downloaded[item.id] && (
              <button
                onClick={() => downloadGuideline(item)}
                style={actionBtnStyle}
              >
                ⬇️ Download
              </button>
            )}

            {downloaded[item.id] && activeTab === "offline" && (
              <button
                onClick={() => deleteOfflineGuideline(item)}
                style={{ ...actionBtnStyle, color: "red" }}
              >
                🗑️ Remove
              </button>
            )}

            <button onClick={() => playAudio(item)} style={actionBtnStyle}>
              ▶️ Play Audio
            </button>

            <button onClick={() => openPdf(item)} style={actionBtnStyle}>
              📄 Open PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Reusable button styles
const actionBtnStyle = {
  padding: "6px 12px",
  backgroundColor: "#f4f4f4",
  border: "1px solid #ddd",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
};
