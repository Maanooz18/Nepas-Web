import React from "react";
import colors from "../../../res/colors";
import { fontFamily, fontSize } from "../../../res/fonts";

export default function AgeInput({
  clearAge,
  setSelectedYear,
  selectedYear,
  selectedMonth,
  setSelectedMonth,
  estimatedWeight,
  hideEstimateWeight,
}) {
  return (
    <>
      <style>{css}</style>

      <div className="section weightSection">

        {/* HEADER */}
        <div className="sectionHeader">
          <p className="valueTitleText">Age</p>
          <span className="clearText" onClick={clearAge}>
            Clear
          </span>
        </div>

        {/* SCROLLER */}
        <div className="scrollerSection">

          {/* YEARS */}
          <div className="scroller years">
            <button
              className="plusButton"
              onClick={() => setSelectedYear(selectedYear + 1)}
            >
              +
            </button>

            <div className="ageInputWrapper">
              <input
                className="ageTextInput"
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
              <span className="ageInputText">years</span>
            </div>

            <button
              className="plusButton"
              onClick={() => {
                if (selectedYear > 0) setSelectedYear(selectedYear - 1);
              }}
            >
              -
            </button>
          </div>

          {/* MONTHS */}
          <div className="scroller months">
            <button
              className="plusButton"
              onClick={() => {
                if (selectedMonth >= 12) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
            >
              +
            </button>

            <div className="ageInputWrapper">
              <input
                className="ageTextInput"
                type="number"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              />
              <span className="ageInputText">months</span>
            </div>

            <button
              className="plusButton"
              onClick={() => {
                if (selectedMonth > 0) setSelectedMonth(selectedMonth - 1);
              }}
            >
              -
            </button>
          </div>
        </div>

        {/* ESTIMATED WEIGHT */}
        {!hideEstimateWeight && (
          <div className="estimatedWeightWrapper">
            <span className="estText">Estimated weight:</span>
            <span className="estValue">{estimatedWeight} kgs</span>
          </div>
        )}
      </div>
    </>
  );
}

const css = `
.section {
  margin-bottom: 15px;
}

.weightSection {
  border: 1px solid ${colors.lightGray};
  padding: 15px;
  border-radius: 10px;
  background-color: ${colors.background};
}

/* HEADER */
.sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.valueTitleText {
  font-family: ${fontFamily.semiBold};
  font-size: ${fontSize.xlarge}px;
  margin-bottom: 5px;
}

.clearText {
  text-decoration: underline;
  color: ${colors.red};
  font-size: ${fontSize.normal - 1}px;
  cursor: pointer;
}

/* SCROLLER */
.scrollerSection {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  gap: 10px;
}

/* BOX */
.scroller {
  flex: 1;
  border-radius: 15px;
  padding: 10px;
  border: 1px solid ${colors.cardBackground};
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* INPUT WRAPPER */
.ageInputWrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

/* INPUT */
.ageTextInput {
  border: none;
  text-align: center;
  width: 50px;
  font-size: ${fontSize.xlarge}px;
  outline: none;
  background: transparent;
}

/* TEXT */
.ageInputText {
  font-size: ${fontSize.large}px;
  margin-left: 4px;
}

/* BUTTON */
.plusButton {
  padding: 3px;
  font-size: ${fontSize.xxxlarge}px;
  border: none;
  background: none;
  cursor: pointer;
}

/* ESTIMATED WEIGHT */
.estimatedWeightWrapper {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.estText {
  font-size: ${fontSize.large}px;
}

.estValue {
  font-family: ${fontFamily.semiBold};
  margin-left: 5px;
  font-size: ${fontSize.xlarge}px;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .scrollerSection {
    flex-direction: column;
  }
}
`;