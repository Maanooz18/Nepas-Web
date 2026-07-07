import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Use useLocation
import { Repeat, ArrowLeft, Square,WatchIcon } from "lucide-react";
import { setData } from "../../../utils/storage"; // Import your helper
import colors from "../../../res/colors";
import { toast } from "react-toastify";

export default function RespiratoryCalculator() {
  const [count, setCount] = useState(0);
  const [timerValue, setTimerValue] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get data from navigation

  // In Web, we check location.state instead of route.params
  const fromPews = location.state?.fromPews;
  const fromDistress = location.state?.fromDistress;
  const calcType = location.state?.type; // e.g., 'heartRate' or 'respRate'

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimerValue((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const onPress = () => {
    setCount((prev) => prev + 1);
    if (!running) setRunning(true);
  };

const onStopPress = () => {
  setRunning(false);

  if (timerValue < 15 && timerValue !== 0) {
    toast.warn(
      <div>
        <div>Measurement below 15 seconds</div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => {
              toast.dismiss();
              setRunning(true);
            }}
            style={{
              padding: "6px 10px",
              border: "none",
              borderRadius: "6px",
              background: "#4caf50",
              color: "white",
              cursor: "pointer"
            }}
          >
            Resume
          </button>

          <button
            onClick={() => {
              toast.dismiss();
              onResetPress();
            }}
            style={{
              padding: "6px 10px",
              border: "none",
              borderRadius: "6px",
              background: "#f44336",
              color: "white",
              cursor: "pointer"
            }}
          >
            Reset
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false
      }
    );

    return;
  }

  toast.success("Measurement stopped");
  setShowResults(true);
};

  const onResetPress = () => {
    setShowResults(false);
    setCount(0);
    setTimerValue(0);
    setRunning(false);
  };

  // WEB WAY: Save to storage so the previous page can pick it up
  const onBackToPews = async () => {
    const rate = Math.round((count / timerValue) * 60);
    
    // Check which field we should populate in PEWS
    if (calcType === 'heartRate') {
      await setData('temp_hr_value', rate);
    } else {
      await setData('temp_rr_value', rate);
    }
    
    navigate(-1);
  };

  return (
    <div >
      <style>{css}</style>
        <div className="container py-3" style={{  maxWidth: "700px",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: "100px" }}>
          <h3 className="header mb-4">Respiratory Calculator</h3>
      {/* <div className="header">Respiratory Calculator</div> */}
      
        {showResults ? (
          <div className="text-center">
            <div className="resultCard">
              <img src="./electrocardiogram.png" className="image" alt="lungs" />
              <h2 className="resultText">
                Rate is <span className="value">{Math.round((count / timerValue) * 60)}</span> breaths/beats per minute
              </h2>
              {(count>0 && timerValue>0) ?
              <>
              <p className="subText">Recorded {count} breaths/beats in {timerValue} seconds</p>
              </>
            :
             <>Insufficient data</>
            }
              
            </div>

            <div className="btnWrapper">
              <button className="resetBtn" onClick={onResetPress}>
                <Repeat size={24} /> Reset
              </button>

              {/* Fixed visibility check */}
              {(fromPews || fromDistress) && (
              <button className="backBtn" onClick={onBackToPews}>
                <ArrowLeft size={20} />
                Back to {fromPews ? "PEWS" : "Distress"}
              </button>
            )}
              </div>
          </div>
        ) : (
          <div className="calcSection">
             <p className="note">Note:1 tap counts as 1 breadth/beats
                (can also be used for heart Rate)</p>
             <div className="tapperWrapper">
               <button className="tapButton" onClick={onPress}>
                 <span className="count">{count === 0 ? "GO" : count}</span>
               </button>
             </div>
             {count >= 1 && (
               <button className="stopBtn" onClick={onStopPress}>
                 <Square size={18} fill="white" /> Stop
               </button>
             )}
             <div className="timerRow">
               {/* <span>⏱</span> */}
               <WatchIcon size={26} />
               <span className="timerText">
                 {String(Math.floor(timerValue / 60)).padStart(2, "0")}:
                 {String(timerValue % 60).padStart(2, "0")}
               </span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

const css = `
  .respiratory-score-card {
    background-color: #f8f9fa;
    border-radius: 20px;
    padding: 30px;
    min-width: 280px;
    max-width: 400px;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

/* CONTAINER */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${colors.background};
  padding: 20px;
  font-family: "Inter", sans-serif;
}

/* HEADER */
.header {
   text-align:center;
    font-size:20px;
    font-weight:600;
    color: #6f74d8;
}

/* CALC SECTION */
.calcSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* NOTE */
.note {
  font-size: 14px;
  text-align: center;
  font-style: italic;
  margin-bottom: 20px;
  color: #666;
  max-width: 300px;
}

/* TAP BUTTON */
.tapButton {
  width: 240px;
  height: 240px;
  border-radius: 30px;
  background: #50C594;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.tapButton:hover {
  transform: scale(1.03);
}

.tapButton:active {
  transform: scale(0.95);
}

/* COUNT */
.count {
  font-size: 72px;
  font-weight: 800;
  color: ${colors.white};
}

/* STOP BUTTON */
.stopBtn {
  margin-top: 25px;
  background: ${colors.lightRed};
  color: ${colors.white};
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}

/* TIMER */
.timerRow {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timerText {
  font-size: 28px;
  font-weight: 600;
  color: ${colors.darkGray};
}

/* RESULT CARD */
.resultCard {
  width: 270px;
  height: 270px;
  background: ${colors.lightestGray};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.image {
  height: 70px;
}

.resultText {
  font-size: 18px;
  font-weight: 600;
  color: ${colors.lightBlack};
}

.value {
  font-size: 32px;
  font-weight: 800;
//   color: ${colors.green};
}

.subText {
  font-size: 14px;
  color: #666;
}

/* BUTTON WRAPPER */
.btnWrapper {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

/* RESET BUTTON */
.resetBtn {
  background: ${colors.golden};
  color: ${colors.black };
  border-radius: 12px;
  padding: 12px 25px;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

/* BACK BUTTON */
.backBtn {
  background: ${colors.blue};
  color: ${colors.black};
  border-radius: 12px;
  padding: 12px 25px;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  min-width: 200px;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}
`;