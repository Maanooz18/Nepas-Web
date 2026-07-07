import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppLayout from "./layout/AppLayout";
import Calculators from "./pages/Calculator/Calculators";
import GuidelinesScreen from "./pages/Guidelines/Guidelines";
import DrugReferenceScreen from "./pages/Calculator/DrugFormulary/DrugFormulary";
import DrugDetailsScreen from "./pages/Calculator/DrugFormulary/DrugDetails";
import PewsCalculator from "./pages/Calculator/PewsCalculator/PewsCalculator";
import RespiratoryCalculator from "./pages/Calculator/RespiratoryCalculator/RespiratoryCalculator";
import JaundiceCalculator from "./pages/Calculator/JaundiceCalculator/JaundiceCalculator";
import RespiratoryDistressCalculator from "./pages/Calculator/RespiratoryDistressCalculator/RespiratoryDistressCalculator";
import WeightHeightCalculator from "./pages/Calculator/weightHeightCalculator/weightHeightCalculator";
import FluidCalculator from "./pages/Calculator/fluidCalculator/FluidCalculator";
import DrugCalculator from "./pages/Calculator/DrugCalculator/DrugCalculator";
import PDFViewerScreen from "./components/PDFViewer/PDFViewerScreen";
// import AudioListPage from "./pages/Audio/AudioList";
// import Audio from "./pages/Audio/AudioList";
export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Calculators />} />
          <Route path="calculators" element={<Calculators />} />
          <Route path="guidelines" element={<GuidelinesScreen />} />
          {/* <Route path="Audio" element={<Audio />} /> */}
          <Route path="drug-formulary" element={<DrugReferenceScreen />} />
          <Route
            path="drug-formulary/:medName"
            element={<DrugDetailsScreen />}
          />
          <Route path="pews-calculator" element={<PewsCalculator />} />
          <Route path="respiratory-rate" element={<RespiratoryCalculator />} />
          <Route path="jaundice-calculator" element={<JaundiceCalculator />} />
          <Route
            path="respiratory-distress-calculator"
            element={<RespiratoryDistressCalculator />}
          />
          <Route
            path="weight-height-calculator"
            element={<WeightHeightCalculator />}
          />
          <Route path="fluid-calculator" element={<FluidCalculator />} />
          <Route path="Drug-Calculator" element={<DrugCalculator />} />
          <Route path="guideline-pdf/:id" element={<PDFViewerScreen />} />
        </Route>
      </Routes>
    </>
  );
}
