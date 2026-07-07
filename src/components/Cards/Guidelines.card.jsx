import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";

export default function GuidelineCard({
  data,
  isMoreMenu,
  rightIconName,
  onPress,
  hasLocalCopy,
}) {
  const getIcon = () => {
    if (rightIconName === "exit-outline") return <ExternalLink size={20} />;
    return <ExternalLink size={20} />;
  };

  return (
    <div style={styles.outsideContainer}>
      
      <div
        onClick={onPress}
        style={styles.card}
        onMouseDown={(e) => (e.currentTarget.style.background = "#f2f4f8")}
        onMouseUp={(e) => (e.currentTarget.style.background = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
      >
        {/* LEFT SECTION */}
        <div style={styles.leftSection}>
          <div style={styles.iconWrapper}>
            {data?.iconName ? (
              <span style={{ fontSize: 20 }}>📘</span>
            ) : (
              <BookOpen size={20} color="#205072" />
            )}
          </div>

          <div style={styles.infoWrapper}>
            <p style={styles.titleText}>{data?.title}</p>
          </div>
        </div>

        {/* RIGHT ICON */}
        {(rightIconName || data?.isExternalLink) && (
          <div style={styles.rightSection}>{getIcon()}</div>
        )}
      </div>
    </div>
  );
}


const styles = {
  outsideContainer: {
    marginBottom: "15px",
  },

  card: {
    borderRadius: "15px",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    background: "#fff",
    transition: "0.2s",
    border: "1px solid #e5e5e5",
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  iconWrapper: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    height: "40px",
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px",
    border: "1px solid #eee",
  },

  infoWrapper: {
    flex: 1,
  },

  titleText: {
    fontSize: "16px",
    margin: 0,
    color: "#333",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
  },
};
