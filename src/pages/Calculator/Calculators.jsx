import React from "react";
import { useNavigate } from "react-router-dom";
// import { Activity, Baby, Droplets, Pill } from "lucide-react";
import AgeInput from "./fluidCalculator/ageInput";
import calculatorButton2 from "../../components/buttons/calculatorButton2";
import CalculatorButton from "../../components/buttons/calculatorsButton";
import {
  Activity,
  Baby,
  Droplets,
  Pill,
  Stethoscope,
  HeartPulse,
  Ruler,
  Wind,
} from "lucide-react";
const iconMap = {
  drug: Pill,
  baby: Baby,
  iv: Droplets,
  Activity: Activity,
  Stethoscope:Stethoscope,
  HeartPulse:HeartPulse,
  Ruler:Ruler,
  Wind:Wind,

};

export default function Calculators() {
  const navigate = useNavigate();

 const calculators = [
  { id: 1, title: "Drug Formulary", icon: Pill, route: "/drug-formulary" },
  { id: 2, title: "PEWS", icon: Baby, route: "/pews-calculator" },
  { id: 3, title: "Jaundice Calculator", icon: Activity, route: "/jaundice-calculator" },
  { id: 4, title: "Respiratory Rate", icon: Wind, route: "/respiratory-rate" },
  { id: 5, title: "Respiratory Distress", icon: HeartPulse, route: "/respiratory-distress-calculator" },
  { id: 6, title: "Weight & Height Chart", icon: Ruler, route: "/weight-height-calculator" },
  { id: 7, title: "IV Fluid Calculator", icon: Droplets, route: "/fluid-calculator" },
  { id: 8, title: "Drug Calculator", icon: Stethoscope, route: "/Drug-calculator" },
];

  return (
    <div className="container-fluid">
      <style>{css}</style>
            <div style={{
           marginBottom: 10,
             }}>
        <h2 style={{
    color: "#205072",
    margin: 0,
  }}>Calculators</h2>
      </div>
      {/* <h2 className="mb-4"></h2> */}

      <div className="row g-3">
        {calculators.map((item) => {
          // const Icon = iconMap[item.iconName] || iconMap.default;
          const Icon = item.icon;
          return (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                onClick={() => navigate(item.route)}
                className="card shadow-sm border-0 h-100"
                style={{
                  minHeight: "220px",
                  backgroundColor: "#F4F6FA",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "15px",
                  textAlign: "center",
                  cursor: "pointer",
                  
                }}
              >
                <Icon size={40} style={{ marginBottom: 12 }} />
                <h5 className="mb-0">{item.title}</h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const css =`

.card {
  transition: all 0.25s ease;
}

/* HOVER EFFECT */
.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  background-color: #ffffff !important;
}

/* ICON HOVER */
.card:hover svg {
  transform: scale(1.2);
  transition: transform 0.25s ease;
}

/* TITLE HOVER */
.card:hover h5 {
  color: #0d6efd;
}
.card {
  transition: all 0.25s ease;
}

/* MOBILE OPTIMIZATION */
@media (max-width: 576px) {
  .card {
    min-height: 180px;
    padding: 12px;
  }

  .card h5 {
    font-size: 16px;
  }

  .card svg {
    width: 30px;
    height: 30px;
  }
}

/* TABLET */
@media (max-width: 768px) {
  .card {
    min-height: 200px;
  }
}
`