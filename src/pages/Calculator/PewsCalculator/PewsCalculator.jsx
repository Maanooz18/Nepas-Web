import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom'; // Web navigation
import { getData, setData } from '../../../utils/storage';
import { calculatorJson } from "../../../utils/calculatorJson";
import { Calculator } from 'lucide-react';
// Components
import CalculatorButton from "../../../components/buttons/calculatorsButton";
import CalculatorButton2 from "../../../components/buttons/calculatorButton2";
import AgeInput from "../fluidCalculator/ageInput";
import { toast } from 'react-toastify';
const PewsCalculator = () => {
    const navigate = useNavigate(); // Hook for web navigation
    
    // Logic States
    const [calcJson, setCalcJson] = useState(calculatorJson);
    const pewsScore = calcJson?.pewsScore ?? {};
    
    // Form Input States
    const [heartRate, setHeartRate] = useState('');
    const [respiratoryRate, setRespiratoryRate] = useState('');
    const [systolicPressure, setSystolicPressure] = useState('');
    const [diastolicPressure, setDiastolicPressure] = useState('');
    const [saturation, setSaturation] = useState('');
    const [refillTime, setRefillTime] = useState('');
    const [temperature, setTemperature] = useState('');
    const [patientOnOxygen, setPatientOnOxygen] = useState(false);
    const [conscious, setConscious] = useState('Yes');
    
    // Age States
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedYear, setSelectedYear] = useState(0);
    
    // UI States
    const [showResult, setShowResult] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [finalValues, setFinalValues] = useState({});

    useEffect(() => {
        const loadSavedConfig = async () => {
            try {
                const savedData = await getData('calculatorJson');
                console.log("Loaded PEWS config from storage:", savedData);
                if (savedData?.pewsScore) {
                    setCalcJson(savedData);
                    console.log("PEWS config loaded successfully from storage.");
                } else {
                    await setData('calculatorJson', calculatorJson);
                    setCalcJson(calculatorJson);
                }
            } catch (err) {
                setCalcJson(calculatorJson);
            }
        };
        loadSavedConfig();
    }, []);

            useEffect(() => {
            const loadTempValues = async () => {
                const hr = await getData("temp_hr_value");
                const rr = await getData("temp_rr_value");

                console.log("HR:", hr);
                console.log("RR:", rr);

                if (hr) {
                setHeartRate(hr);
                localStorage.removeItem("temp_hr_value");
                }

                if (rr) {
                setRespiratoryRate(rr);
                localStorage.removeItem("temp_rr_value");
                }
            };

            loadTempValues();
            }, []);

    const calculateAgeGroup = () => {
        const y = parseInt(selectedYear) || 0;
        const m = parseInt(selectedMonth) || 0;
        if (y <= 0 && m < 12) return 'under1';
        if ((y === 0 && m === 12) || (y === 1 && m < 12)) return 'between1to2';
        if ((y >= 2 && y <= 4) || (y === 1 && m === 12)) return 'between2to4';
        if (y >= 5 && y <= 11) return 'between5to11';
        return 'above12';
    };

    const getScore = (value, type) => {
        if (value === '' || value === null) return undefined;
        const numVal = Number(value);
        const age = calculateAgeGroup();
        const ranges = pewsScore[age]?.[type];
        let score = undefined;
        ranges?.forEach((range) => {
            if (numVal >= range?.low && numVal <= range?.high) score = range?.value;
        });
        return score;
    };

                const calculate = () => {
            if (!selectedYear && !selectedMonth) {
                toast.warning("Please enter patient age");
                return;
            }

            if (!heartRate || !respiratoryRate || !saturation) {
                toast.error("Please fill all required vital signs");
                return;
            }

            const finalVal = {
                heartRate: getScore(heartRate, "heartRate") ?? "+",
                bp: getScore(diastolicPressure, "bp") ?? "+",
                crt: getScore(refillTime, "crt") ?? "+",
                respRate: getScore(respiratoryRate, "respRate") ?? "+",
                saO2: getScore(saturation, "spO2") ?? "+",
                o2Delivery: patientOnOxygen ? 1 : 0,
                temperature: getScore(temperature, "temperature") ?? "+",
                conscious: conscious === "Yes" ? 0 : 3,
            };

            const total = Object.values(finalVal).reduce(
                (acc, curr) => acc + (_.isNumber(curr) ? curr : 0),
                0
            );

            setTableData([
                ["Heart rate", heartRate, "-", finalVal.heartRate],
                ["Respiratory rate", respiratoryRate, "-", finalVal.respRate],
                ["Saturation", saturation, "-", finalVal.saO2],
            ]);

            setFinalValues(finalVal);
            setShowResult(true);

            
            if (total <= 2) {
                toast.success("Low PEWS score (Stable patient)");
            } else if (total <= 5) {
                toast.info("Moderate PEWS score (Monitor closely)");
            } else {
                toast.error("High PEWS score (Urgent attention required)");
            }
            };

                const onReset = () => {
                setShowResult(false);
                setShowDetails(false);

                setHeartRate("");
                setRespiratoryRate("");
                setSystolicPressure("");
                setDiastolicPressure("");
                setSaturation("");
                setRefillTime("");
                setTemperature("");
                setPatientOnOxygen(false);
                setConscious("Yes");

                setSelectedMonth(0);
                setSelectedYear(0);

                setFinalValues({});
                setTableData([]);

                toast.info("PEWS form reset");
                };
      const clearAge = () => {
    setSelectedYear(0);
    setSelectedMonth(0);
  };


    return (
        <div>
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
            <h3 className="header mb-4">PEWS Calculator</h3>
            {showResult ? (
                <div className="card border-0 shadow-sm text-center p-4">
                    <h5 className="text-secondary fw-bold">PEWS Score</h5>
                    <div className="display-1 fw-bold my-3">
                        {Object.values(finalValues).reduce((acc, curr) => acc + (_.isNumber(curr) ? curr : 0), 0)}
                    </div>

                    <button className="btn btn-link mb-3" onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? 'Hide' : 'Show'} Details
                    </button>

                    {showDetails && (
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered align-middle small custom-table">
                                <thead className="table-light">
                                    <tr><th>Test</th><th>Value</th><th>Rate</th><th>Score</th></tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, i) => (
                                        <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-3">
                        <CalculatorButton2 title="Reset" onClick={onReset} className="btn-orange" />
                    </div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm p-3">
                    <AgeInput 
                        hideEstimateWeight
                        setSelectedYear={setSelectedYear} selectedYear={selectedYear}
                        setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}
                        clearAge={clearAge}
                    />

                    <div className="mt-4">
                        {/* Heart Rate with Calculator Icon */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Heart Rate</label>
                            <div className="input-group">
                                <input type="number" className="form-control" value={heartRate} onChange={e => setHeartRate(e.target.value)} placeholder="Heart beats per minute" />
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => navigate('/respiratory-rate', { state: { fromPews: true, type: 'heartRate' } })}
                                >
                                    <Calculator size={22} />
                                    {/* <i className="bi bi-calculator-fill"></i> */}
                                </button>
                            </div>
                        </div>

                        {/* Respiratory Rate with Calculator Icon */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Respiratory Rate</label>
                            <div className="input-group">
                                <input type="number" className="form-control" value={respiratoryRate} onChange={e => setRespiratoryRate(e.target.value)} placeholder="Respiratory rate per minute" />
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => navigate('/respiratory-rate', { state: { fromPews: true, type: 'respRate' } })}
                                >
                                     <Calculator size={22} />
                                    {/* <i className="bi bi-calculator-fill"></i> */}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold small">Blood Pressure (Sys/Dia)</label>
                            <div className="row g-2">
                                <div className="col"><input type="number" className="form-control" placeholder="Systolic mm Hg" value={systolicPressure} onChange={e => setSystolicPressure(e.target.value)} /></div>
                                <div className="col"><input type="number" className="form-control" placeholder="Diastolic mm Hg" value={diastolicPressure} onChange={e => setDiastolicPressure(e.target.value)} /></div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold small">Oxygen Level (Saturation)</label>
                            <input type="number" className="form-control" placeholder="Saturation Level in %" value={saturation} onChange={e => setSaturation(e.target.value)} />
                        </div>

                        <div className="mb-3 d-flex justify-content-between align-items-center p-2 border rounded bg-light">
                            <span className="small fw-bold">Patient On Oxygen?</span>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={patientOnOxygen} onChange={e => setPatientOnOxygen(e.target.checked)} />
                                <label className="form-check-label small">{patientOnOxygen ? 'Yes' : 'No'}</label>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label fw-bold small">Temperature</label>
                                <input type="number" className="form-control" placeholder='Temperature in celcius' value={temperature} onChange={e => setTemperature(e.target.value)} />
                            </div>
                            <div className="col">
                                <label className="form-label fw-bold small">Capillary Refill Time</label>
                                <input type="number" className="form-control" placeholder='refill Time in seconds' value={refillTime} onChange={e => setRefillTime(e.target.value)} />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold small d-block">Conscious</label>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conscious" checked={conscious === 'Yes'} onChange={() => setConscious('Yes')} />
                                <label className="form-check-label small ms-1">Alert</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conscious" checked={conscious === 'No'} onChange={() => setConscious('No')} />
                                <label className="form-check-label small ms-1">V/P/U</label>
                            </div>
                        </div>

                        <CalculatorButton title="Calculate" onClick={calculate} />
                    </div>
                </div>
            )}
        </div>
             </div>
    );
};

export default PewsCalculator;

const css = `  .pews-score-card {
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

.score-display {
    font-size: 5rem;
    font-weight: 800;
    line-height: 1;
    margin: 20px 0;
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

.custom-table {
    background: white;
    font-size: 0.85rem;
}

.form-control:focus {
    border-color: #0d6efd;
    box-shadow: none;
}

.form-switch .form-check-input {
    width: 3em;
    height: 1.5em;
    cursor: pointer;
} 
    

// .pews-score-card {
//     background-color: #f8f9fa;
//     border-radius: 20px;
//     padding: 30px;
//     min-width: 280px;
//     max-width: 400px;
//     aspect-ratio: 1 / 1;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
// }

.score-display {
    font-size: 5rem;
    font-weight: 800;
    line-height: 1;
    margin: 20px 0;
}

.btn-orange {
    background-color: #fd7e14 !important; /* Match theme.colors.orange */
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

.custom-table {
    background: white;
    font-size: 0.85rem;
}

.form-switch .form-check-input {
    width: 2.5em;
    height: 1.25em;
    cursor: pointer;
}`