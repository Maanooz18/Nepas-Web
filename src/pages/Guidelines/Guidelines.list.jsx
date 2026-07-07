// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import GuidelineCard from "../../components/Cards/Guidelines.card";
// import { getData } from "../../utils/storage";
// import { get } from "lodash";
// export default function GuidelinesList({ data = [], handleRefresh }) {
//   const navigate = useNavigate();
//   const [localFilesList, setLocalFilesList] = useState([]);

//   useEffect(() => {
//     // In web we cannot use react-native-fs
//     // so assume local files come from API or localStorage
//     const getDatas = async () => {
//       const files = (await getData("guidelines")) || "[]";
//       console.log(files, "files");
//       setLocalFilesList(files);
//     };
//     getDatas();
//   }, [data]);

//   return (
//     <div style={styles.container}>
//       {data?.length === 0 ? (
//         <div style={styles.empty}>No guidelines found</div>
//       ) : (
//         data.map((item, index) => {
//           let hasLocalCopy = localFilesList?.some(
//             (file) =>
//               file.name ===
//               `${item?.title?.replaceAll("/", "-")}-${item?.id}.pdf`,
//           );

//           return (
//             <div key={item.id} style={{ marginTop: index === 0 ? 15 : 0 }}>
//               <GuidelineCard
//                 data={item}
//                 rightIconName={
//                   hasLocalCopy
//                     ? "document-text-outline"
//                     : "cloud-offline-outline"
//                 }
//                 onPress={() =>
//                   navigate(`/guideline-pdf/${item.id}`, {
//                     state: { data: item },
//                   })
//                 }
//                 hasLocalCopy={hasLocalCopy}
//               />
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     padding: 16,
//   },
//   empty: {
//     textAlign: "center",
//     marginTop: 40,
//     color: "#888",
//   },
// };

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuidelineCard from "../../components/Cards/Guidelines.card";
import { getAllKeys } from "../../utils/storage";

// --- NEW: Added showOnlyDownloaded prop ---
export default function GuidelinesList({
  data = [],
  refreshTrigger,
  showOnlyDownloaded = false,
}) {
  const navigate = useNavigate();
  const [cachedUrls, setCachedUrls] = useState([]);

  useEffect(() => {
    // --- NEW: Uses IndexedDB to check actual downloaded Blob keys ---
    const fetchCachedKeys = async () => {
      try {
        const keys = await getAllKeys();
        setCachedUrls(keys || []);
      } catch (error) {
        console.error("Error fetching IndexedDB keys:", error);
      }
    };

    fetchCachedKeys();

    window.addEventListener("focus", fetchCachedKeys);
    return () => window.removeEventListener("focus", fetchCachedKeys);
  }, [data, refreshTrigger]);

  // --- NEW: Filter data if user is on the Offline Downloads tab ---
  const displayData = showOnlyDownloaded
    ? data.filter(
        (item) => item?.pdfFile?.url && cachedUrls.includes(item.pdfFile.url),
      )
    : data;

  return (
    <div style={styles.container}>
      {displayData?.length === 0 ? (
        <div style={styles.empty}>
          {showOnlyDownloaded
            ? "You haven't downloaded any offline PDFs yet."
            : "No guidelines found"}
        </div>
      ) : (
        displayData.map((item, index) => {
          const pdfUrl = item?.pdfFile?.url;
          // Verify if the PDF's URL exists in our IndexedDB cache
          const hasLocalCopy = pdfUrl ? cachedUrls.includes(pdfUrl) : false;

          return (
            <div key={item.id} style={{ marginTop: index === 0 ? 15 : 0 }}>
              <GuidelineCard
                data={item}
                rightIconName={
                  hasLocalCopy
                    ? "document-text-outline"
                    : "cloud-offline-outline"
                }
                onPress={() =>
                  navigate(`/guideline-pdf/${item.id}`, {
                    state: { data: item },
                  })
                }
                hasLocalCopy={hasLocalCopy}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "16px 0",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    padding: "40px 20px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #ccc",
  },
};
