import React from "react";
// import { IonIcon } from "react-ion-icon";

import { Calculator } from "lucide-react";

export default function CalculatorButton({
  onClick,
  title,
  iconName,
  backgroundColor = "#FCCA46",
  style = {},
  textStyle = {},
}) {
  return (
    <>
      <style>{css}</style>

      <button
        className="btnWrapper"
        style={{  backgroundColor: backgroundColor || colors.cardBackground, ...style }}
        onClick={onClick}
      >
        {/* ICON */}
        <Calculator size={28} className="icon" />

        {/* TEXT */}
        <span className="btnText">{title}</span>
      </button>
    </>
  );
}

const css = `
.btnWrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 10px 20px;

  border-radius: 15px;
  border: none;

  cursor: pointer;

  /* shadow (RN elevation equivalent) */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  transition: all 0.25s ease;
}

.btnWrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* ICON */
.icon {
  margin-right: 6px;
}

/* TEXT */
.btnText {
  font-size: 20px;
  font-weight: 600;
  color: #212121;
}
`