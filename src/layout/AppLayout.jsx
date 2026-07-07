// import {Outlet} from 'react-router-dom';
// import SideBar from '../components/SideBar';
// import Calculators from '../pages/Calculator/Calculators';
// export default function AppLayout() {
//   return (
//     // <div style={{ display: "flex", height: "100vh" }}>
//     //   <SideBar />
//     //   <div style={{ flex: 1, padding: 20 }}>
//     //     <Outlet />
//     //   </div>
//     // </div>

//     <div className="d-flex">
//   <SideBar />

//   <div
//     style={{
//       marginLeft: "220px",
//       width: "100%",
//       padding: "20px",
//     }}
//     className="d-none d-md-block"
//   >
//     <Outlet />
//   </div>

//   {/* Mobile content */}
//   <div className="d-md-none w-100 p-3">
//     <Outlet />
//   </div>
// </div>
//   );
// }

// import { Outlet } from "react-router-dom";
// import SideBar from "../components/SideBar";

// export default function AppLayout() {
//   return (
//     <div className="app-layout">
//       <style>{css}</style>
//       <SideBar />

//       <div className="main-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useState } from "react";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <style>{css} </style>

      <SideBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`main-content ${collapsed ? "collapsed" : ""}`}
      >
        <Outlet />
      </div>
    </div>
  );
}

const css =`
.app-layout {
  display: flex;
}

/* MAIN CONTENT BASE */
.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 220px;
  transition: margin-left 0.3s ease;
}

/* WHEN COLLAPSED */
.main-content.collapsed {
  margin-left: 70px;
}

/* MOBILE */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding-top: 60px;
  }
}`