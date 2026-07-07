// import localforage from "localforage";

// const db = localforage.createInstance({
//   name: "nepas-web",
// });

// export const downloadAndCachePdf = async (url) => {
//   try {
//     // 1. Direct fetch! No proxies needed since CORS is fixed at the server.
//     const response = await fetch(url);

//     // Check 1: HTTP Status
//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
//     }

//     // Check 2: Content-Type Validation
//     const contentType = response.headers.get("content-type") || "";
//     if (!contentType.includes("application/pdf")) {
//       throw new Error(
//         `Invalid content type: Expected application/pdf but got ${contentType}.`,
//       );
//     }

//     const blob = await response.blob();

//     // Check 3: File Size Validation
//     if (blob.size < 1000) {
//       throw new Error(
//         `File too small (${blob.size} bytes). Likely an HTML error page, not a real PDF.`,
//       );
//     }

//     // Store strictly using the ORIGINAL URL as the key
//     await db.setItem(url, blob);
//     return blob;
//   } catch (error) {
//     console.error(`PDF caching failed for ${url}:`, error);
//     throw error; // Rethrow to be caught by the UI
//   }
// };

// export const getOfflinePdf = async (url) => {
//   try {
//     return await db.getItem(url);
//   } catch (error) {
//     console.error("Error retrieving cached PDF:", error);
//     return null;
//   }
// };

// export const isPdfDownloaded = async (url) => {
//   try {
//     const keys = await db.keys();
//     return keys.includes(url);
//   } catch (error) {
//     console.error("Error checking PDF status:", error);
//     return false;
//   }
// };

// export const deleteOfflinePdf = async (url) => {
//   try {
//     await db.removeItem(url);
//   } catch (error) {
//     console.error("Error deleting cached PDF:", error);
//   }
// };

// export const clearOfflinePdfs = async () => {
//   try {
//     const keys = await db.keys();
//     for (const key of keys) {
//       if (key.startsWith("http")) {
//         await db.removeItem(key);
//       }
//     }
//   } catch (error) {
//     console.error("Error clearing offline PDFs:", error);
//   }
// };

import localforage from "localforage";

const db = localforage.createInstance({
  name: "nepas-web",
});

export const downloadAndCachePdf = async (url) => {
  try {
    // TEMPORARY FIX: Using CodeTabs public proxy to bypass CORS restrictions
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);

    // Check 1: HTTP Status
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Check 2: Content-Type Validation
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/pdf")) {
      throw new Error(
        `Invalid content type: Expected application/pdf but got ${contentType}.`,
      );
    }

    const blob = await response.blob();

    // Check 3: File Size Validation
    if (blob.size < 1000) {
      throw new Error(
        `File too small (${blob.size} bytes). Likely an HTML error page, not a real PDF.`,
      );
    }

    // Store strictly using the ORIGINAL URL as the key.
    // This ensures your UI still recognizes the WordPress URL as downloaded.
    await db.setItem(url, blob);
    return blob;
  } catch (error) {
    console.error(`PDF caching failed for ${url}:`, error);
    throw error; // Rethrow to be caught by the UI
  }
};

export const getOfflinePdf = async (url) => {
  try {
    return await db.getItem(url);
  } catch (error) {
    console.error("Error retrieving cached PDF:", error);
    return null;
  }
};

export const isPdfDownloaded = async (url) => {
  try {
    const keys = await db.keys();
    return keys.includes(url);
  } catch (error) {
    console.error("Error checking PDF status:", error);
    return false;
  }
};

export const deleteOfflinePdf = async (url) => {
  try {
    await db.removeItem(url);
  } catch (error) {
    console.error("Error deleting cached PDF:", error);
  }
};

export const clearOfflinePdfs = async () => {
  try {
    const keys = await db.keys();
    for (const key of keys) {
      if (key.startsWith("http")) {
        await db.removeItem(key);
      }
    }
  } catch (error) {
    console.error("Error clearing offline PDFs:", error);
  }
};
