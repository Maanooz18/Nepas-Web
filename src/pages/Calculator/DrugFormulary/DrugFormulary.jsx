import React, { useState, useMemo, useEffect } from "react";
import { DrugReferenceJson } from "../../../utils/calculatorJson";
import { useNavigate } from "react-router-dom";
import { calculatorJson } from "../../../utils/calculatorJson";
import { getData,setData } from "../../../utils/storage";
import { Filter } from "lucide-react";
const ALPHABET = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export default function DrugReferenceScreen() {
  const [drugs, setDrugs] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
const [selectedSection, setSelectedSection] = useState("");
const [selectedSubSection, setSelectedSubSection] = useState("");
  const [search, setSearch] = useState("");
    const navigate = useNavigate();
 
   useEffect(() => {
  const loadData = async () => {
    try {
      const savedData = await getData("drugReference");
      console.log("Loaded drug data from local storage:", savedData);
      if (savedData && savedData.length > 0) {
        setDrugs(savedData);
      } else {
        await setData("drugReference", DrugReferenceJson);
        setDrugs(DrugReferenceJson);
      }
    } catch (e) {
      console.error("Error loading local drug data", e);
      setDrugs(DrugReferenceJson);
    }
  };

  loadData();
}, []);

  // const filteredDrugs = useMemo(() => {
  //   let data = drugs;

  //   if (selectedLetter !== "All") {
  //     data = data.filter((d) =>
  //       d.MedName?.toUpperCase().startsWith(selectedLetter)
  //     );
  //   }

  //   if (search.trim()) {
  //     const q = search.toUpperCase();
  //     data = data.filter(
  //       (d) =>
  //         d.MedName?.toUpperCase().includes(q) ||
  //         d.SubSection?.toUpperCase().includes(q)
  //     );
  //   }

  //   return data;
  // }, [drugs, selectedLetter, search]);

  const sections = useMemo(() => {
  const unique = [
    ...new Set(
      drugs.map((i) => i.Section?.trim()).filter(Boolean)
    ),
  ];
  return unique;
}, [drugs]);

const subSections = useMemo(() => {
  if (!selectedSection) return [];

  const filtered = drugs.filter(
    (i) => i.Section?.trim() === selectedSection
  );

  const unique = [
    ...new Set(
      filtered.map((i) => i.SubSection?.trim()).filter(Boolean)
    ),
  ];

  return unique;
}, [selectedSection, drugs]);


const filteredDrugs = useMemo(() => {
  let data = drugs;

  // alphabet filter
  if (selectedLetter !== "All") {
    data = data.filter((d) =>
      d.MedName?.toUpperCase().startsWith(selectedLetter)
    );
  }

  // search filter
  if (search.trim()) {
    const q = search.toUpperCase();
    data = data.filter(
      (d) =>
        d.MedName?.toUpperCase().includes(q) ||
        d.SubSection?.toUpperCase().includes(q)
    );
  }

  if (selectedSection) {
    data = data.filter(
      (d) => d.Section?.trim() === selectedSection
    );
  }

  
  if (selectedSubSection) {
    data = data.filter(
      (d) => d.SubSection?.trim() === selectedSubSection
    );
  }

  return data;
}, [drugs, selectedLetter, search, selectedSection, selectedSubSection]);



  return (
    <>
      <style>{css}</style>

     <div className="page container-fluid">
          <div className="nav">
          <p className="title">Drug Formulary</p>

           <div onClick={() => setShowFilterModal(true)} style={{ cursor: "pointer" }}>
            {/* <p>Filter</p> */}
            <Filter size={32} />
          </div>
        </div>
    
        {/* SEARCH */}
        <div className="searchBox">
          <input
            placeholder="Search drug or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ALPHABET */}
        <div className="alphabet">
          {ALPHABET.map((char) => (
            <button
              key={char}
              className={`alphaBtn ${
                selectedLetter === char ? "active" : ""
              }`}
              onClick={() => setSelectedLetter(char)}
            >
              {char}
            </button>
          ))}
        </div>

        {/* GRID */}

      {/* GRID */}
<div className="row g-3 m-0 p-0"> 
  {filteredDrugs.length === 0 ? (
    <p className="empty">No drugs found</p>
  ) : (
    filteredDrugs.map((drug, i) => (
      /* col-12 ensures it takes full width on mobile, col-md-6 for tablet/desktop */
      <div key={i} className="col-12 col-md-6 col-lg-4 d-flex">
        <div
          className="card shadow-sm border-0"
       onClick={() =>
        navigate(`/drug-formulary/${encodeURIComponent(drug.MedName)}`)
      }
        >
          <div className="card-body-content">
            <h3>{drug.MedName}</h3>
            <p className="sub">{drug.SubSection}</p>

            <div className="tags">
              <span className="tag red">{drug["C/U"]}</span>
              <span className="tag blue">{drug["S/DF"] || "N/A"}</span>
            </div>

            <p className="dose">{drug.Dose || "N/A"}</p>
          </div>
        </div>
      </div>
    ))
  )}
</div>
      </div>

      {showFilterModal && (
  <div className="modalBackdrop" onClick={() => setShowFilterModal(false)}>
    <div className="modalBox" onClick={(e) => e.stopPropagation()}>

      <p>Drugs Filter</p>

      {/* SECTION */}
      <label>Section</label>
      <select
        value={selectedSection}
        onChange={(e) => {
          setSelectedSection(e.target.value);
          setSelectedSubSection("");
        }}
      >
        <option value="">All</option>
        {sections.map((sec, i) => (
          <option key={i} value={sec}>
            {sec}
          </option>
        ))}
      </select>

      {/* SUBSECTION */}
      <label>Sub Section</label>
      <select
        value={selectedSubSection}
        onChange={(e) => setSelectedSubSection(e.target.value)}
      >
        <option value="">All</option>
        {subSections.map((sub, i) => (
          <option key={i} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      {/* ACTIONS */}
      <div className="modalActions">
        <button onClick={() => setShowFilterModal(false)}>
          Apply
        </button>

        <button
          onClick={() => {
            setSelectedSection("");
            setSelectedSubSection("");
          }}
        >
          Reset
        </button>
      </div>

    </div>
  </div>
)}
    </>
  );
}



const css = `

* {
    box-sizing: border-box;
  max-width: 100%;
}

// body {
//   margin: 0;
//   overflow-x: hidden;
//   font-family: Arial;
// }


.page {
  padding: 12px;
  background: #f6f7fb;
  min-height: 100vh;
  overflow-x: hidden;
  max-width: 100%;
}

/* prevent bootstrap row overflow */
.row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* IMPORTANT FIX for grid overflow inside columns */
.col-12,
.col-sm-12,
.col-md-6,
.col-lg-4 {
  min-width: 0;
}


.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #205072;
  letter-spacing: 0.5px;
  margin: 0;
}

.title::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: #edc7c6;
  margin-top: 6px;
  border-radius: 2px;
}


.searchBox input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
}


.alphabet {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 10px 0;
  margin: 10px 0;
}

.alphaBtn {
  flex: 0 0 auto;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
}

.alphaBtn.active {
  background: #edc7c6;
  border-color: #edc7c6;
  font-weight: bold;
}

.card {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  word-break: break-word;
  overflow-wrap: anywhere;
  background: white;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 25px rgba(0,0,0,0.12);
}

.card h3 {
  margin: 0;
  font-size: 15px;
  color: #333;
  word-break: break-word;
}

.sub {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
  word-break: break-word;
}


.tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
}

.tag.red {
  background: #f7e4e4;
  color: #e47976;
  border: 1px solid #c4b0b0;
}

.tag.blue {
  background: #c3d3df;
  color: #205072;
}

.dose {
  font-size: 11px;
  margin-top: 6px;
  color: #444;
  word-break: break-word;
}


.empty {
  text-align: center;
  margin-top: 40px;
  color: #888;
}


.modalBackdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modalBox {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
}

.modalBox label {
  display: block;
  margin-top: 10px;
  font-size: 14px;
}

.modalBox select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.modalActions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.modalActions button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modalActions button:first-child {
  background: #205072;
  color: white;
}

.modalActions button:last-child {
  background: #eee;
}
`;