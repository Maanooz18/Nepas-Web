import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Repeat, ArrowLeft } from "lucide-react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScatterController,
  LineController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import calculatorButton2 from "../../../components/buttons/calculatorButton2";
import CalculatorButton from "../../../components/buttons/calculatorsButton";
// Standard storage helpers
import { setData, getData } from "../../../utils/storage";
// Import your existing JSON data
// import { calculatorJson } from "../../../utils/calculatorJson";
import { photometry, transfusion } from "../../../utils/calculatorJson";
import { toast } from "react-toastify";
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  LineController,
  Tooltip,
  Legend
);

export default function JaundiceCalculator() {
  const navigate = useNavigate();
  

  // Form States
  const [bilirubinUnit, setBilirubinUnit] = useState('mg/dL');
  const [bilirubinLevel, setBilirubinLevel] = useState('');
  const [gestation, setGestation] = useState('');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState('');
  const [calcJson, setCalcJson] = useState({
  photometry: [],
  transfusion: []
});
//    const { photometry = [], transfusion = [] } = calcJson || {};

  // UI States
  const [showResult, setShowResult] = useState(false);
  const [chartData, setChartData] = useState(null);
  
const isValidArray = (arr) => Array.isArray(arr) && arr.length > 0;
useEffect(() => {
  const loadSavedConfig = async () => {
    try {
      const savedPhotometry = await getData("photometry");
      const savedTransfusion = await getData("transfusion");

      console.log("Loaded from storage:", {
        savedPhotometry,
        savedTransfusion,
      });

      const finalData = {
        photometry: isValidArray(savedPhotometry)
          ? savedPhotometry
          : photometry,

        transfusion: isValidArray(savedTransfusion)
          ? savedTransfusion
          : transfusion,
      };

      setCalcJson(finalData);

      // initialize storage only if empty
      if (!isValidArray(savedPhotometry)) {
        await setData("photometry", photometry);
      }

      if (!isValidArray(savedTransfusion)) {
        await setData("transfusion", transfusion);
      }
    } catch (err) {
      console.log("Storage load error:", err);
      setCalcJson({ photometry, transfusion });
    }
  };

  loadSavedConfig();
}, []);

  const calculateAgeInHours = () => {
    let ageInHrs = 0;
    if (!days || days === 0) {
      ageInHrs = Number(hours || 0);
    } else {
      ageInHrs = Number(days) * 24 + Number(hours || 0);
    }
    return ageInHrs;
  };

  const plotDataset = () => {
    let isInMg = bilirubinUnit === 'mg/dL';
    let phototherapyDS = [];
    let transfusionDS = [];


    const photoData = calcJson?.photometry || [];
    const transfusionData = calcJson?.transfusion || [];

    photoData.forEach((data) => {
      if (Number(gestation) >= data?.gestationLevel?.min && Number(gestation) <= data?.gestationLevel.max) {
        phototherapyDS = isInMg ? data?.data : data?.dataMMOL;
      }
    });

    transfusionData.forEach((data) => {
      if (Number(gestation) >= data?.gestationLevel?.min && Number(gestation) <= data?.gestationLevel.max) {
        transfusionDS = isInMg ? data?.data : data?.dataMMOL;
      }
    });

    return { phototherapyDS, transfusionDS };
  };

  const generateGraph = () => {
    const { phototherapyDS, transfusionDS } = plotDataset();
    const age = calculateAgeInHours();

    setChartData({
      datasets: [
        {
          type: 'line',
          label: 'Phototherapy',
          data: phototherapyDS.map(p => ({ x: p.x, y: p.y })),
          borderColor: 'blue',
          backgroundColor: 'blue',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.1
        },
        {
          type: 'line',
          label: 'Exchange Transfusion',
          data: transfusionDS.map(p => ({ x: p.x, y: p.y })),
          borderColor: 'red',
          backgroundColor: 'red',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.1
        },
        {
          type: 'scatter',
          label: 'Your Patient',
          data: [{ x: Number(age), y: Number(bilirubinLevel) }],
          backgroundColor: 'green',
          pointRadius: 8,
          pointHoverRadius: 10,
        }
      ]
    });
  };

const calculate = () => {
  const ageHrs = calculateAgeInHours();

  if ((Number(days) <= 0 && Number(hours) <= 0)) {
    toast.warning("Enter valid age");
    return;
  }

  if (Number(gestation) < 27 || Number(gestation) > 42) {
    toast.warning("Gestation must be between 27–42 weeks");
    return;
  }

  if (!bilirubinLevel || Number(bilirubinLevel) <= 0) {
    toast.error("Bilirubin level is required");
    return;
  }

  if (ageHrs > 144) {
    toast.warning("Age must be less than 6 days (144 hours)");
    return;
  }

  generateGraph();
  setShowResult(true);

  //  smart clinical feedback based on bilirubin level
  const bili = Number(bilirubinLevel);

  if (bili < 10) {
    toast.success("Low risk jaundice range");
  } else if (bili <= 15) {
    toast.info("Moderate risk — monitor closely");
  } else {
    toast.error("High risk jaundice — consider intervention");
  }
};
 const onResetPress = () => {
  setShowResult(false);
  setDays(0);
  setHours('');
  setBilirubinLevel('');
  setGestation('');
  setChartData(null);

  toast.info("Jaundice calculator reset");
};

  return (
      <div>
      <style>{css}</style>
      <div className="jaundice-calculator p-3" style={{ fontFamily: 'sans-serif' , maxWidth: "700px",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: "100px"}}>
      <div className="header p-3 mb-4  rounded">
        <h4 className=" text-center fw-bold">Jaundice Calculator</h4>
      </div>

      <div className="container" style={{ maxWidth: '600px' }}>
        {showResult ? (
          <div className="result-section">
            <div className="chart-card bg-white p-3 shadow-sm rounded-4 mb-4">
               <p className="text-center small fw-bold text-muted mb-0">TSB ({bilirubinUnit}) vs Hours of Life</p>
               {chartData && (
                 <div style={{ height: '400px' }}>
                   <Chart 
                     type="bar" 
                     data={chartData} 
                     options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       scales: {
                         x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Hours of life' }, min: 0, max: 150 },
                         y: { title: { display: true, text: `Bilirubin (${bilirubinUnit})` }, min: 0 }
                       },
                       plugins: {
                         legend: { position: 'bottom' }
                       }
                     }} 
                   />
                 </div>
               )}
            </div>

            <div className="d-grid gap-3">
              <button className="btn btn-warning py-3 text-white fw-bold d-flex align-items-center justify-content-center gap-2" onClick={onResetPress}>
                <Repeat size={20} /> Reset
              </button>
              <button className="btn btn-secondary py-3 fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => setShowResult(false)}>
                <ArrowLeft size={20} /> Back
              </button>
            </div>
          </div>
        ) : (
          <div className="input-section bg-white p-4 shadow-sm rounded-4 border">
            {/* Age Section */}
            <div className="mb-4">
              <label className="form-label fw-bold">Age</label>
              <div className="row g-2">
                <div className="col">
                  <input type="number" className="form-control p-3" placeholder="Days" value={days} onChange={e => setDays(e.target.value)} />
                </div>
                <div className="col">
                  <input type="number" className="form-control p-3" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Gestation Section */}
            <div className="mb-4">
              <label className="form-label fw-bold">Gestation of baby (weeks)</label>
              <input type="number" className="form-control p-3" placeholder="Value in weeks" value={gestation} onChange={e => setGestation(e.target.value)} />
            </div>

            {/* Bilirubin Section */}
            <div className="mb-4">
              <label className="form-label fw-bold">Bilirubin Level</label>
              <div className="row g-2">
                <div className="col-7">
                  <input type="number" className="form-control p-3" placeholder="Level" value={bilirubinLevel} onChange={e => setBilirubinLevel(e.target.value)} />
                </div>
                <div className="col-5">
                  <select className="form-select h-100" value={bilirubinUnit} onChange={e => setBilirubinUnit(e.target.value)}>
                    <option value="mg/dL">mg/dL</option>
                    <option value="mmol/L">mmol/L</option>
                  </select>
                </div>
              </div>
            </div>

            {/* <button className="btn btn-primary w-100 py-3 fw-bold rounded-3 mt-2 shadow" style={{backgroundColor: '#6f74d8', border: 'none'}} onClick={calculate}>
              
                <CalculatorButton2 title="Calculate" onClick={calculate} className="btn-orange" />
            </button> */}
             <div className="mt-3">
                <CalculatorButton title="Calculate" onClick={calculate} />
                </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

const css = `
  body { background-color: #f8f9fa; }
  .form-control, .form-select {
    border-radius: 12px;
    border: 1px solid #dee2e6;
  }
  .form-control:focus {
    box-shadow: 0 0 0 0.25rem rgba(111, 116, 216, 0.25);
    border-color: #6f74d8;
  }
    .header{
    text-align:center;
    font-size:20px;
    font-weight:600;
    color: #6f74d8;
}
  .btn-warning { background-color: #ff9800; border: none; border-radius: 12px; }
  .btn-secondary { background-color: #6c757d; border: none; border-radius: 12px; }
`;