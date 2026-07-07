import React, { useEffect, useState } from "react";

const MedicineSelectionModal = ({
  isVisible,
  closeModal,
  handleItemSelection,
  drugs = [],
}) => {
  const [keyword, setKeyword] = useState("");
  const [filteredDrugs, setFilteredDrugs] = useState(drugs);

  useEffect(() => {
    if (isVisible) {
      setFilteredDrugs(drugs);
      setKeyword("");
    }
  }, [isVisible, drugs]);

  const handleTextChange = (value) => {
    setKeyword(value);

    const newArr = drugs.filter((item) =>
     (item?.drug || "").toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDrugs(newArr);
  };

  const handleSelection = (item) => {
    closeModal();
    handleItemSelection(item);
  };

  if (!isVisible) return null;

  return (
    <div style={styles.backdrop} onClick={closeModal}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        
        {/* Search Input */}
        <input
          placeholder="Search Drug"
          value={keyword}
          onChange={(e) => handleTextChange(e.target.value)}
          style={styles.input}
        />

        {/* List */}
        <div style={styles.listContainer}>
          {filteredDrugs?.length > 0 ? (
            filteredDrugs.map((item, index) => (
              <div
               key={item?.id || item?.drug || index}
                style={styles.listItem}
                onClick={() => handleSelection(item)}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {item?.drug}
                </span>{" "}
                -{" "}
                <span style={styles.doseText}>
                  {item?.route?.map((routeItem, routeIndex) => (
                    <span key={routeIndex}>
                      {routeItem?.toUpperCase()}
                      {routeIndex + 1 < item?.route?.length ? ", " : ""}
                    </span>
                  ))}
                </span>
              </div>
            ))
          ) : (
            <div style={styles.noDrugText}>No drug found</div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 999,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "400px",
    maxHeight: "70vh",
    overflowY: "auto",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ccc",
    borderRadius: 6,
  },
  listContainer: {
    maxHeight: "55vh",
    overflowY: "auto",
  },
  listItem: {
    padding: 10,
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  doseText: {
    color: "gray",
  },
  noDrugText: {
    textAlign: "center",
    marginTop: 15,
    color: "gray",
  },
};

export default MedicineSelectionModal;