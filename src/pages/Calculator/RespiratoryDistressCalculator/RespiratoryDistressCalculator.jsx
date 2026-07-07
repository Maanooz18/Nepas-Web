import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Repeat } from "lucide-react";
import CalculatorButton from "../../../components/buttons/calculatorsButton";
import CalculatorButton2 from "../../../components/buttons/calculatorButton2";
import AgeInput from "../fluidCalculator/ageInput";
import { getData } from "../../../utils/storage";
import { Calculator } from "lucide-react";
import { setData } from "../../../utils/storage";
import { calculatorJson } from "../../../utils/calculatorJson";
import { toast } from "react-toastify";

export default function RespiratoryDistressCalculator() {
  const navigate = useNavigate();

  const [calcJson, setCalcJson] = useState({});
  const respiratoryDistress = calcJson?.respiratoryDistress;

  const [retractions, setRetractions] = useState();
  const [grunting, setGrunting] = useState();
  const [breathSounds, setBreathSounds] = useState();
  const [respiratoryRate, setRespiratoryRate] = useState();
  const [oxygenRequired, setOxygenRequired] = useState("None");
  const [oxygenRequirement, setOxygenRequirement] = useState(0);
  const [prematurity, setPrematurity] = useState();
  const [showResult, setShowResult] = useState(false);
  const [downeScore, setDowneScore] = useState(0);

  useEffect(() => {
    getCalculatorJson();
  }, []);

 const getCalculatorJson = async () => {
  const data = await getData("calculatorJson");

  if (data?.respiratoryDistress) {
    setCalcJson(data);
  } else {
    // fallback for offline / first load
    setCalcJson(calculatorJson);
  }
};


useEffect(() => {
  const handleFocus = async () => {
    const tempRR = await getData('temp_rr_value');
    if (tempRR) {
      setRespiratoryRate(tempRR.toString());
      await setData('temp_rr_value', null);
    }
  };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
        }, []);

     const calculate = () => {
  if (
    !respiratoryRate ||
    !retractions ||
    !grunting ||
    !breathSounds ||
    !prematurity
  ) {
    toast.error("Please fill all required fields");
    return;
  }

      let totalScore =
        getRespiratoryRateScore() +
        getOxygenRequirementScore() +
        getRetractionsScore() +
        getGruntingScore() +
        getBreathSoundsScore() +
        getPrematurityScore();

      setDowneScore(totalScore);
      setShowResult(true);

      toast.success("Score calculated successfully");
    };

  const getRespiratoryRateScore = () => {
    let respRate = 0;
    respiratoryDistress?.respiratoryRate?.forEach((range) => {
      if (respiratoryRate >= range?.min && respiratoryRate <= range?.max) {
        respRate = range?.value;
      }
    });
    return respRate;
  };

  const getOxygenRequirementScore = () => {
    let oxyReq = 0;
    respiratoryDistress?.oxygenRequirement?.forEach((range) => {
      if (oxygenRequirement >= range?.min && oxygenRequirement <= range?.max) {
        oxyReq = range?.value;
      }
    });
    return oxyReq;
  };

  const getRetractionsScore = () => {
    let ret = 0;
    respiratoryDistress?.retractions?.forEach((range) => {
      if (retractions === range?.answer) {
        ret = range?.value;
      }
    });
    return ret;
  };

  const getGruntingScore = () => {
    let grunt = 0;
    respiratoryDistress?.grunting?.forEach((range) => {
      if (grunting === range?.answer) {
        grunt = range?.value;
      }
    });
    return grunt;
  };

  const getBreathSoundsScore = () => {
    let breath = 0;
    respiratoryDistress?.breathSounds?.forEach((range) => {
      if (breathSounds === range?.answer) {
        breath = range?.value;
      }
    });
    return breath;
  };

  const getPrematurityScore = () => {
    let prem = 0;
    respiratoryDistress?.prematurity?.forEach((range) => {
      if (prematurity >= range?.min && prematurity <= range?.max) {
        prem = range?.value;
      }
    });
    return prem;
  };
    const onResetPress = () => {
      setShowResult(false);
      setRespiratoryRate();
      setOxygenRequired("None");
      setOxygenRequirement(0);
      setDowneScore(0);
      setRetractions();
      setGrunting();
      setBreathSounds();
      setPrematurity();

      toast.info("Form reset successfully");
    };

  const distressValue = () => {
    if (downeScore < 5) return "Mild";
    if (downeScore <= 8) return "Moderate";
    return "Severe";
  };
  
const getRespiratoryRateFromCalculator = (value) => {
  setRespiratoryRate(value?.toString());
  toast.success("Respiratory rate updated");
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
            <h3 className="header mb-4">Distress Calculator</h3>
      {showResult ? (
        <div className="text-center">
          <div className="result-card">
            <h4>Downe Score</h4>
            <h1 className="score">{downeScore}</h1>
            <p>{distressValue()} respiratory distress</p>
          </div>

          <div className="mt-4">
            <CalculatorButton2
              title="Reset"
              icon={<Repeat size={18} />}
              onClick={onResetPress}
            />
          </div>
        </div>
      ) : (
        <div className="card p-4 shadow-sm rounded-4">
          
          {/* Respiratory Rate */}
          <div className="mb-3">
            <label className="form-label fw-bold small">Respiratory rate</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                placeholder="Respiratory rate per min"
                value={respiratoryRate || ""}
                onChange={(e) => setRespiratoryRate(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() =>
                  navigate("/respiratory-rate", {
                    state: {
                      fromDistress: true,
                      type: "respRate",
                    //   getRespCalculatorData: getRespiratoryRateFromCalculator,
                    },
                  })
                }
              >
                <Calculator size={22} />
              </button>
            </div>
          </div>

          {/* Oxygen */}
          <div className="mb-3">
            <label className="fw-bold">Oxygen requirement</label>

            <div>
              <input
                type="radio"
                checked={oxygenRequired === "None"}
                onChange={() => {
                  setOxygenRequired("None");
                  setOxygenRequirement(0);
                }}
              />{" "}
              None
            </div>

            <div>
              <input
                type="radio"
                checked={oxygenRequired === "Required"}
                onChange={() => setOxygenRequired("Required")}
              />{" "}
              Required
            </div>

            {oxygenRequired === "Required" && (
              <input
                type="number"
                className="form-control mt-2"
                placeholder="Oxygen %"
                value={oxygenRequirement || ""}
                onChange={(e) => setOxygenRequirement(e.target.value)}
              />
            )}
          </div>

          {/* Retractions */}
          <div className="mb-3">
            <label className="fw-bold">Retractions</label>
            {["None", "Mild to moderate", "Severe"].map((val) => (
              <div key={val}>
                <input
                  type="radio"
                  checked={retractions === val}
                  onChange={() => setRetractions(val)}
                />{" "}
                {val}
              </div>
            ))}
          </div>

          {/* Grunting */}
          <div className="mb-3">
            <label className="fw-bold">Grunting</label>
            {["None", "With simulation", "At rest"].map((val) => (
              <div key={val}>
                <input
                  type="radio"
                  checked={grunting === val}
                  onChange={() => setGrunting(val)}
                />{" "}
                {val}
              </div>
            ))}
          </div>

          {/* Breath Sounds */}
          <div className="mb-3">
            <label className="fw-bold">Breath Sounds</label>
            {["Normal", "Decreased", "Barely heard"].map((val) => (
              <div key={val}>
                <input
                  type="radio"
                  checked={breathSounds === val}
                  onChange={() => setBreathSounds(val)}
                />{" "}
                {val}
              </div>
            ))}
          </div>

          {/* Prematurity */}
          <div className="mb-3">
            <label className="fw-bold">Prematurity (weeks)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Prematurity(weeks)"
              value={prematurity || ""}
              onChange={(e) => setPrematurity(e.target.value)}
            />
          </div>

          <CalculatorButton title="Calculate" onClick={calculate} />
        </div>
      )}
    </div>
    </div>
  );
}

const css = `
.result-card {
  background: #eee;
  padding: 30px;
  border-radius: 20px;
}
.score {
  font-size: 80px;
  font-weight: bold;
}
  .header{
    text-align:center;
    font-size:20px;
    font-weight:600;
    color: #6f74d8;
}
  .btn-orange {
    background-color: #fd7e14 !important;
    color: white !important;
    border-radius: 10px;
    padding: 10px 40px;
}
    .btn-outline-secondary {
    border-color: #ced4da;
    color: #495057;
}

.btn-outline-secondary:hover {
    background-color: #f8f9fa;
    color: #000;
}
`;