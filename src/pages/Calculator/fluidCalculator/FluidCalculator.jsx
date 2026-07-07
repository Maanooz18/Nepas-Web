import React, { useEffect, useState } from "react";
import CalculatorButton from "../../../components/buttons/calculatorsButton";
import calculatorButton2 from "../../../components/buttons/calculatorButton2";
import AgeInput from "../fluidCalculator/ageInput";
import { getData } from "../../../utils/storage";
import colors from "../../../res/colors";
// import {Fluid}
import { toast } from "react-toastify";
export default function FluidCalculator() {
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [estimatedWeight, setEstimatedWeight] = useState(0);
  const [weight, setWeight] = useState(0);

  const [selectedFluid, setSelectedFluid] = useState("maintenance");

  const [totalFluid, setTotalFluid] = useState(0);
  const [hourlyFluid, setHourlyFluid] = useState(0);
  const [bolusFluid, setBolusFluid] = useState(0);
  const [bolusGlucose, setBolusGlucose] = useState(0);

  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (selectedMonth > 0 || selectedYear > 0) {
      estimateWeight();
      setSelectedWeight(0);
    }
  }, [selectedMonth, selectedYear]);

  const clearAge = () => {
    setSelectedYear(0);
    setSelectedMonth(0);
    setEstimatedWeight(0);
  };

  const clearWeight = () => {
    setSelectedWeight(0);
  };

  const estimateWeight = () => {
    if (selectedMonth <= 0 && selectedYear <= 0) return;

    let estWeight = 0;

    if (selectedYear <= 0 && selectedMonth <= 12) {
      estWeight = selectedMonth * 0.5 + 4;
    } else if (selectedYear >= 1 && selectedYear <= 5) {
      estWeight = selectedYear * 2 + 8;
    } else if (selectedYear >= 6) {
      estWeight = selectedYear * 3 + 7;
    }

    setEstimatedWeight(estWeight);
    setWeight(estWeight);
  };

  const calculate = () => {
  if (Number(weight) <= 0) {
    toast.warning("Enter valid weight or age");
    return;
  }

  if (!selectedFluid) {
    toast.warning("Select fluid type");
    return;
  }

  if (selectedFluid === "maintenance") {
    calculateMaintenanceFluid();
    toast.success("Maintenance fluid calculated");
  } else if (selectedFluid === "bolusFluid") {
    calculateBolusFluids();
    toast.success("Bolus fluid calculated");
  } else {
    calculateBolusGlucose();
    toast.success("Glucose bolus calculated");
  }
};

  const calculateMaintenanceFluid = () => {
    let w = Number(weight);
    let fluid = 0;

    let sub10 = w - 10;

    if (sub10 < 0) {
      fluid = w * 100;
    } else if (sub10 < 10) {
      fluid = 10 * 100 + sub10 * 50;
    } else {
      let next10 = sub10 - 10;
      fluid = 10 * 100 + 10 * 50 + next10 * 20;
    }

    setTotalFluid(Math.round(fluid));
    setHourlyFluid(Math.round(fluid / 24));
    setShowResult(true);
  };

  const calculateBolusFluids = () => {
    setBolusFluid(Number(weight) * 10);
    setShowResult(true);
  };

  const calculateBolusGlucose = () => {
    setBolusGlucose(Number(weight) * 2);
    setShowResult(true);
  };

  const onResetPress = () => {
  setShowResult(false);
  setBolusFluid(0);
  setBolusGlucose(0);
  setHourlyFluid(0);
  setTotalFluid(0);
  setSelectedMonth(0);
  setSelectedYear(0);
  setEstimatedWeight(0);
  setWeight(0);
  setSelectedWeight(0);

  toast.info("Form reset successfully");
};
  const onBackPress = () => {
    setShowResult(false);
  };

  return (
     <div className="container py-3" style={{ maxWidth: 700 }}>
      <style>{css}</style>
        <div className="container py-3" style={{
            maxWidth: "700px",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: "100px"
        }}>
            <div>
            </div>
            <h3 className="header mb-4">IV Fluid Calculator</h3>
      {showResult ? (
        <div className="result">
          <div className="resultSection">
            <img src="/iv.png" className="resultImage" alt="iv" />

            <p className="text">
              <span className="title">Weight:</span> {weight} kg
            </p>

            {totalFluid ? (
              <p className="text">
                <span className="title">Total Fluid:</span> {totalFluid} ml
              </p>
            ) : null}

            {hourlyFluid ? (
              <p className="text">
                <span className="title">Hourly Fluid:</span> {hourlyFluid} ml/hr
              </p>
            ) : null}

            {bolusFluid ? (
              <p className="text">
                <span className="title">Bolus Fluid:</span> {bolusFluid} ml NS
              </p>
            ) : null}

            {bolusGlucose ? (
              <p className="text">
                <span className="title">Bolus Glucose:</span> {bolusGlucose} ml D10
              </p>
            ) : null}
          </div>

          <div className="btnRow">
            <calculatorButton2 title="Back" onClick={onBackPress} />
            <CalculatorButton title="Reset" onClick={onResetPress} />
          </div>
        </div>
      ) : (
        <div className="box">
                <div className="section">
            <div className="labelRow">
                <label>Weight</label>
                <span className="clearText" onClick={clearWeight}>
                Clear
                </span>
            </div>

            <div className="inputWrapper">
                <input
                type="number"
                placeholder="Weight of child in kgs"
                value={selectedWeight || ""}
                onChange={(e) => {
                    setSelectedWeight(Number(e.target.value));
                    setWeight(Number(e.target.value));
                }}
                />
            </div>
            </div>

          <div className="or">OR</div>

          <AgeInput
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            clearAge={clearAge}
            estimatedWeight={estimatedWeight}
          />

          <div className="section">
            <label>Fluid Type</label>

            <div>
              <input
                type="radio"
                checked={selectedFluid === "bolusGlucose"}
                onChange={() => setSelectedFluid("bolusGlucose")}
              />
              Glucose
            </div>

            <div>
              <input
                type="radio"
                checked={selectedFluid === "bolusFluid"}
                onChange={() => setSelectedFluid("bolusFluid")}
              />
              Bolus
            </div>

            <div>
              <input
                type="radio"
                checked={selectedFluid === "maintenance"}
                onChange={() => setSelectedFluid("maintenance")}
              />
              Maintenance
            </div>
             <CalculatorButton title="Calculate" onClick={calculate} />
           
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

const css = `
// .container {
//   padding: 15px;
//   background: #f5f6fa;
// //   min-height: 100vh;
// }


.box {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
}
  .header{
    text-align:center;
    font-size:20px;
    font-weight:600;
    color: #6f74d8;
}
.labelRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.labelRow label {
  font-weight: 600;
}

.clearText {
  font-size: 12px;
  color: #ff4d4f;
  cursor: pointer;
  font-weight: 600;
  user-select: none;
}
.section {
  margin-bottom: 15px;
}

.section label {
  font-weight: 600;
  margin-bottom: 5px;
//   display: block;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.or {
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
}

.result {
  text-align: center;
}

.resultSection {
  background: #eee;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.resultImage {
  height: 70px;
  margin-bottom: 10px;
}

.text {
  font-size: 16px;
  margin: 5px 0;
}

.title {
  font-weight: bold;
}

.btnRow {
  display: flex;
  gap: 10px;
  justify-content: center;
}`