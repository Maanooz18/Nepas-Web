import React, { useState, useEffect } from "react";
import CalculatorButton from "../../../components/buttons/calculatorsButton";
import CalculatorButton2 from "../../../components/buttons/calculatorButton2";
import AgeInput from "../fluidCalculator/ageInput";
import { getData } from "../../../utils/storage";
import { fontFamily,fontSize, } from "../../../res/fonts";
import colors from "../../../res/colors";
import { toast } from "react-toastify";
export default function WeightHeightCalculator() {
  const [calcJson, setCalcJson] = useState({});
  const weightHeight = calcJson?.weightHeight;

  const [showResult, setShowResult] = useState(false);
  const [gender, setGender] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  const [recommendedWeightHeight, setRecommendedWeightHeight] = useState();
  const [weightTableData, setWeightTableData] = useState([]);
  const [heightTableData, setHeightTableData] = useState([]);
  const [enteredTableData, setEnteredTableData] = useState([]);
  const [weightRange, setWeightRange] = useState("");
  const [heightRange, setHeightRange] = useState("");

  useEffect(() => {
    getCalculatorJson();
  }, []);

  const getCalculatorJson = async () => {
    const data = await getData("calculatorJson");
    if (data?.weightHeight) {
      setCalcJson(data);
    }
  };

const calculate = () => {
  if (
    (selectedMonth <= 0 && selectedYear <= 0) ||
    (selectedMonth === undefined && selectedYear === undefined)
  ) {
    toast.warning("Enter valid age");
    return;
  }

  if (gender === "") {
    toast.warning("Select a gender");
    return;
  }

  if (height <= 0) {
    toast.warning("Enter valid height");
    return;
  }

  if (weight <= 0) {
    toast.warning("Enter valid weight");
    return;
  }

  let age = calculateAge();
  let calcObj = weightHeight[gender?.toLowerCase()][age];

  if (!calcObj) {
    toast.error("No reference data found for selected age/gender");
    return;
  }

  setRecommendedWeightHeight(calcObj);
  setShowResult(true);

  setHeightTableData([
    [calcObj?.height?.min, calcObj?.height?.mid, calcObj?.height?.max],
  ]);

  setWeightTableData([
    [calcObj?.weight?.min, calcObj?.weight?.mid, calcObj?.weight?.max],
  ]);

  let weightRangeValue = checkRange(
    weight,
    calcObj?.weight?.min,
    calcObj?.weight?.max
  );

  let heightRangeValue = checkRange(
    height,
    calcObj?.height?.min,
    calcObj?.height?.max
  );

  setHeightRange(heightRangeValue);
  setWeightRange(weightRangeValue);

  setEnteredTableData([
    [
      "Age",
      `${selectedYear ? `${selectedYear}yr` : ""} ${
        selectedMonth ? `${selectedMonth}mo` : ""
      }`,
    ],
    ["Gender", gender],
  ]);

  toast.success("Calculation completed");
};

  const calculateAge = () => {
    let monthDecimal = selectedMonth >= 6 ? 0.6 : 0;
    return selectedYear + monthDecimal;
  };

  const checkRange = (value, min, max) => {
    if (value < min) return "under";
    if (value > max) return "over";
    return "within";
  };

  const onResetPress = () => {
  setShowResult(false);
  setSelectedMonth(0);
  setSelectedYear(0);
  setGender("");
  setHeight(0);
  setWeight(0);

  toast.info("Form reset successfully");
};

  const clearAge = () => {
    setSelectedYear(0);
    setSelectedMonth(0);
  };

  return (
    <div className="container py-3" style={{ maxWidth: 700 }}>
      <style>{css}</style>
            <h3 className="header mb-4">Weight & Height Calculator</h3>
      {showResult ? (
        <div className="text-center">
          <div className="result-card">
            <h4>Result</h4>

            <table className="table table-bordered mt-3">
              <tbody>
                {enteredTableData.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h6 className="weight">Weight: {weight} kg</h6>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Min</th>
                  <th>Mid</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {weightTableData.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p>*Weight is {weightRange} the normal range</p>

            <h6 className="weight">Height: {height} cm</h6>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Min</th>
                  <th>Mid</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {heightTableData.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p>*Height is {heightRange} the normal range</p>
          </div>

          <div className="mt-3">
            <CalculatorButton2 title="Reset" onClick={onResetPress} />
          </div>
        </div>
      ) : (
        <>
          {/* Age Input */}
          <AgeInput
            hideEstimateWeight
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            selectedMonth={selectedMonth}
            clearAge={clearAge}
          />

          <div className="card p-4 shadow-sm rounded-4 mt-3">
            {/* Gender */}
            <div className="mb-3">
              <label className="fw-bold">Gender</label>
              <div>
                <input
                  type="radio"
                  checked={gender === "Male"}
                  onChange={() => setGender("Male")}
                />{" "}
                Male
              </div>
              <div>
                <input
                  type="radio"
                  checked={gender === "Female"}
                  onChange={() => setGender("Female")}
                />{" "}
                Female
              </div>
            </div>

            {/* Height */}
            <div className="mb-3">
              <label className="fw-bold">Height (cm)</label>
              <input
                type="number"
                className="form-control"
                value={height || ""}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            {/* Weight */}
            <div className="mb-3">
              <label className="fw-bold">Weight (kg)</label>
              <input
                type="number"
                className="form-control"
                value={weight || ""}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <CalculatorButton title="Calculate" onClick={calculate} />
          </div>
        </>
      )}
    </div>
  );
}
const css = `
/* RESULT CARD */
.result-card {
  background: ${colors.lightGray};
  padding: 20px;
  border-radius: 20px;
  text-align: center;
}

/* HEADER */
.header {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #6f74d8;
}

/* INPUT CARD */
.card {
  border-radius: 15px;
  border: 1px solid ${colors.cardBackground};
}

/* LABEL */
label {
  font-family: ${fontFamily.semiBold};
  color: ${colors.lightBlack};
  font-size: ${fontSize.normal + 1}px;
  margin-bottom: 5px;
}

/* TABLE WRAPPER */
.table {
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid ${colors.lightPrimary};
}

/* TABLE HEADER */
.table thead {
  background: ${colors.lightGray};
}

/* TABLE CELL */
.table td,
.table th {
  text-align: center;
  padding: 6px;
  font-size: ${fontSize.normal + 1}px;
  font-family: ${fontFamily.regular};
  color: ${colors.lightBlack};
}

/* SECTION TITLE (Weight / Height) */
.weight {
  background: ${colors.lightPrimary};
  text-align: center;
  padding: 6px;
  color: ${colors.darkGray};
  font-family: ${fontFamily.semiBold};
  font-size: ${fontSize.large}px;
  border-radius: 10px 10px 0 0;
}

/* REMARK TEXT */
p {
  font-size: ${fontSize.normal}px;
  text-align: center;
  margin-top: 6px;
}

/* RESULT TITLE */
h4 {
  font-size: ${fontSize.xlarge}px;
  font-family: ${fontFamily.semiBold};
}
`;