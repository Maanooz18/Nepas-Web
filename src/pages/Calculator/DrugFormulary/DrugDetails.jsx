import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { DrugReferenceJson } from "../../../utils/calculatorJson";

export default function DrugDetailsScreen() {
  // const { medName } = useParams();

  // const drug = useMemo(() => {
  //   return DrugReferenceJson.find(
  //     (d) =>
  //       d.MedName?.toLowerCase() === medName?.toLowerCase()
  //   );
  // }, [medName]);

  const { medName } = useParams();
const decodedName = decodeURIComponent(medName);

const drug = useMemo(() => {
  return DrugReferenceJson.find(
    (d) =>
      d.MedName?.toLowerCase() === decodedName?.toLowerCase()
  );
}, [decodedName]);

  if (!drug) {
    return (
      <div style={styles.center}>
        <h3>Drug not found</h3>
      </div>
    );
  }

  const get = (v) => v || "N/A";

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.headerCard}>
        <h2 style={styles.title}>{drug.MedName}</h2>

        <span style={styles.subSection}>
          {get(drug.SubSection)}
        </span>

        <div style={styles.row}>
          <span style={styles.badge}>
            {get(drug["S/DF"])}
          </span>
        </div>
      </div>

      {/* DOSAGE */}
      <div style={styles.doseBox}>
        <h4 style={styles.label}>Standard Dosage</h4>
        <p style={styles.doseText}>{get(drug.Dose)}</p>
      </div>

      {/* DETAILS */}
      <Detail label="Common Uses" value={drug["C/U"]} />
      <Detail label="Adverse Effects" value={drug["A/E"]} />
      <Detail label="Contraindications" value={drug.CI} />

      {/* SPECIAL INSTRUCTIONS */}
      <div style={styles.instructionBox}>
        <h4 style={{ ...styles.label, color: "#856404" }}>
          Special Instructions
        </h4>
        <p style={styles.instructionText}>
          {get(drug.SI)}
        </p>
      </div>

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={styles.item}>
      <h5 style={styles.label}>{label}</h5>
      <p style={styles.value}>{value || "N/A"}</p>
    </div>
  );
}


const styles = {
  page: {
    padding: "16px",
    maxWidth: "1500px",
    margin: "0 auto",
    fontFamily: "Arial",
    background: "#fff",
  },

  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    background: "#ddf1ef",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "20px",
    color: "#205072",
  },

  subSection: {
    display: "inline-block",
    marginTop: "8px",
    background: "#f7e4e4",
    color: "#e47976",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "12px",
  },

  row: {
    marginTop: "10px",
  },

  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #6878a0",
    background: "#e2e6f5",
    color: "#354c84",
    fontSize: "12px",
    fontWeight: "600",
  },

  doseBox: {
    background: "#f8f9fa",
    padding: "14px",
    borderRadius: "10px",
    borderLeft: "4px solid #354c84",
    marginBottom: "20px",
  },

  doseText: {
    margin: 0,
    fontWeight: "600",
    color: "#333",
  },

  item: {
    marginBottom: "16px",
  },

  label: {
    fontSize: "11px",
    color: "#888",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: "4px",
  },

  value: {
    margin: 0,
    fontSize: "14px",
    color: "#444",
    lineHeight: "1.5",
  },

  instructionBox: {
    background: "#fff3cd",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ffeeba",
    marginTop: "10px",
  },

  instructionText: {
    margin: 0,
    color: "#856404",
    fontStyle: "italic",
  },
};