import React, { useEffect, useState } from "react";
import CalculatorButton from "../../../components/buttons/calculatorsButton";
import calculatorButton2 from "../../../components/buttons/calculatorButton2";
import AgeInput from "../fluidCalculator/ageInput";
import MedicineSelectionModal from "../../../components/Medicine/Medicine";
import { getData } from "../../../utils/storage";
import { toast } from "react-toastify";

import { calculatorJson } from "../../../utils/calculatorJson";
export default function DrugCalculator() {
  const [calcJson, setCalcJson] = useState(null);

  const drugsAbbreviation = calcJson?.drugsAbbreviation;

  const [weight, setWeight] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [estimatedWeight, setEstimatedWeight] = useState(0);
  const [finalWeight, setFinalWeight] = useState(0);

  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showMedicineModal, setShowMedicineModal] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [showRef, setShowRef] = useState(false);

  const [resultTableData, setResultTableData] = useState([]);
  const [referenceTableData, setReferenceTableData] = useState([]);

  const [hasReachedMaxDose, setHasReachedMaxDose] = useState(false);

  useEffect(() => {
    getCalculatorJson();
  }, []);

  const getCalculatorJson = async () => {
    try {
      const localData = await getData("calculatorJson");

      const data =
        calculatorJson && Object.keys(calculatorJson).length > 0
          ? calculatorJson
          : localData;

      if (data) {
        setCalcJson(data);
      } else {
        toast.error("Calculator data not available");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearAge = () => {
    setSelectedYear(0);
    setSelectedMonth(0);
  };

  const estimateWeight = () => {
    setWeight(0);

    if (selectedMonth <= 0 && selectedYear <= 0) {
      toast.warning("Enter age to estimate weight");
      return;
    }
    let est = 0;

    if (selectedYear <= 0 && selectedMonth <= 12) {
      est = selectedMonth * 0.5 + 4;
    } else if (selectedYear >= 1 && selectedYear <= 5) {
      est = selectedYear * 2 + 8;
    } else if (selectedYear >= 6) {
      est = selectedYear * 3 + 7;
    }

    setEstimatedWeight(est);
    setFinalWeight(est);
  };

  const decodeAbbreviation = (abbr) => {
    return drugsAbbreviation?.[abbr] || abbr;
  };

  const formatNumber = (num) => {
    if (!num) return 0;
    return Number(num).toFixed(2).replace(/\.00$/, "");
  };

  const getFrequency = (freq) => {
    switch (freq) {
      case "od":
        return 24;
      case "bd":
        return 12;
      case "tds":
        return 8;
      case "qid":
        return 6;
      default:
        return 0;
    }
  };

  const getDose = (drug) => {
    setHasReachedMaxDose(false);

    try {
      let freq = 24 / getFrequency(drug?.frequency);
      let maxPerDose = drug?.maxPerDose;

      if (drug?.unit === "mg/day") {
        maxPerDose = drug?.maxPerDose / freq;
      }

      if (
        maxPerDose &&
        (drug?.maxDose * finalWeight > maxPerDose ||
          drug?.minDose * finalWeight > maxPerDose)
      ) {
        setHasReachedMaxDose(true);
        return `${formatNumber(maxPerDose)} mg/dose *`;
      }

      return drug?.maxDose === drug?.minDose
        ? `${formatNumber(drug?.maxDose * finalWeight)} mg/dose`
        : `${formatNumber(
            drug?.minDose * finalWeight,
          )} - ${formatNumber(drug?.maxDose * finalWeight)} mg/dose`;
    } catch (e) {
      return "Error";
    }
  };

  const calculate = () => {
    if (!selectedDrug) {
      toast.warning("Please select a drug");
      return;
    }

    if (finalWeight <= 0) {
      toast.warning("Enter or estimate a valid weight");
      return;
    }

    if (selectedMonth <= 0 && selectedYear <= 0) {
      toast.warning("Please enter a valid age");
      return;
    }

    setShowResult(true);

    setResultTableData([
      [
        "Age",
        `${selectedYear ? selectedYear + "yr" : ""} ${
          selectedMonth ? selectedMonth + "mo" : ""
        }`,
      ],
      ["Weight", `${finalWeight}kg`],
      ["Dose", getDose(selectedDrug)],
      ["Frequency", decodeAbbreviation(selectedDrug?.frequency)],
      ["Renal Adjustment?", selectedDrug?.renalAdjustment ? "Yes" : "No"],
    ]);

    setReferenceTableData([
      [
        "Min-Max Dose",
        selectedDrug?.maxDose
          ? `${selectedDrug?.minDose} - ${selectedDrug?.maxDose} mg/kg/dose`
          : "N/A",
      ],
      [
        "Max per dose",
        selectedDrug?.maxPerDose
          ? `${selectedDrug?.maxPerDose} ${selectedDrug?.unit || ""}`
          : "Not specified",
      ],
      ["Route", selectedDrug?.route?.join(", ")?.toUpperCase() || ""],
      ["Frequency", decodeAbbreviation(selectedDrug?.frequency)],
    ]);

    toast.success("Calculation completed");
  };
  const onResetPress = () => {
    setShowResult(false);
    setSelectedDrug(null);
    setSelectedMonth(0);
    setSelectedYear(0);
    setFinalWeight(0);
    setWeight(0);
    setEstimatedWeight(0);
    setShowRef(false);

    toast.info("Form reset successfully");
  };

  return (
    <div className="container py-3" style={{ maxWidth: 700, margin: "auto" }}>
      <style>{css}</style>

      {!showResult ? (
        <>
          <h3 className="header mb-4">PEWS Calculator</h3>
          <AgeInput
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            clearAge={clearAge}
          />

          <div className="mb-3">
            <label className="fw-bold">Weight</label>
            <input
              type="number"
              value={weight || ""}
              onChange={(e) => {
                setWeight(Number(e.target.value));
                setFinalWeight(Number(e.target.value));
              }}
            />

            <p>OR</p>

            <button
              className="form-control estimate-btn"
              onClick={estimateWeight}
            >
              Estimate Weight
            </button>

            {estimatedWeight > 0 && <p>Estimated: {estimatedWeight} kg</p>}

            <div className="drugBox">
              <input
                readOnly
                value={selectedDrug?.drug || ""}
                placeholder="Select Drug"
                onClick={() => setShowMedicineModal(true)}
              />
            </div>

            <CalculatorButton title="Calculate" onClick={calculate} />
          </div>

          <MedicineSelectionModal
            isVisible={showMedicineModal}
            closeModal={() => setShowMedicineModal(false)}
            // onSelect={(drug) => setSelectedDrug(drug)}
            handleItemSelection={(drug) => {
              console.log("SELECTED:", drug); // debug
              setShowMedicineModal(false);
              setSelectedDrug(drug);
            }}
            drugs={calcJson?.drugs || []}
          />
        </>
      ) : (
        <div className="resultBox">
          <h3>{selectedDrug?.drug}</h3>

          <table>
            <tbody>
              {resultTableData.map((row, i) => (
                <tr key={i}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setShowRef(!showRef)}>
            {showRef ? "Hide" : "Show"} Reference
          </button>

          {showRef && (
            <table>
              <tbody>
                {referenceTableData.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <calculatorButton2 title="Reset" onClick={onResetPress} />
        </div>
      )}
    </div>
  );
}
const css = `
/* MAIN CONTAINER */
.container {
  padding: 16px;
  max-width: 700px;
  margin: auto;
}

/* INPUT CARD */
.box {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
}
.estimate-btn {
  border-radius: 8px; 
  padding: 10px 12px;
  font-weight: 600;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.estimate-btn:hover {
  background-color: #e9ecef;
}
/* LABEL */
label {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: #333;
}
  .header{
    text-align:center;
    font-size:20px;
    font-weight:600;
    color: #6f74d8;
}

/* INPUT */
input {
  width: 100%;
  padding: 10px 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: #6f74d8;
}

/* DRUG SELECT BOX */
.drugBox input {
  cursor: pointer;
  background: #f5f5f5;
  font-weight: 500;
}

/* ESTIMATION TEXT */
p {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

/* BUTTON SPACING */
button {
  margin-top: 10px;
}

/* RESULT BOX */
.resultBox {
  text-align: center;
  padding: 10px;
}

/* RESULT TITLE */
.resultBox h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: capitalize;
}

/* TABLE WRAPPER */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

/* TABLE CELLS */
td {
  border: 1px solid #eee;
  padding: 10px;
  font-size: 14px;
  text-align: center;
  color: #333;
}

/* TABLE ROW HOVER */
tr:hover {
  background: #f9f9f9;
}

/* REFERENCE TOGGLE BUTTON */
.resultBox button {
  margin-top: 12px;
  padding: 8px 12px;
  border: none;
  background: #6f74d8;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.resultBox button:hover {
  opacity: 0.9;
}

/* RESET BUTTON */
.resetBtn {
  margin-top: 15px;
}
`;
