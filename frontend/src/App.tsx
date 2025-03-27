// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Dashboard } from "./pages/dashboard/DashBoard";
// import Login from "./pages/login/Login";
// import { Register } from "./pages/register/Register";
// import { Room } from "./pages/room/Room";
// import { Setting } from "./pages/setting/Setting";
// import { History } from "./pages/history/History";
// import { Utility } from "./pages/utility/Utility";
// import { NotFound } from "./pages/notFound/NotFound";
// import { Member } from "./pages/member/Member";
// import AdminLayout from "./layouts/AdminLayout";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
        
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="/admin/member" element={<Member />} />
//           <Route path="/admin/room" element={<Room />} />
//           <Route path="/admin/setting" element={<Setting />} />
//           <Route path="/admin/history" element={<History />} />
//           <Route path="/admin/utility" element={<Utility />} />
//         </Route>

//         {/* Trang 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/DashBoard";
import Login from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { Room } from "./pages/room/Room";
import { SettingsPersonalInformation } from "./pages/setting/SettingsPersonalInformation";
import { History } from "./pages/history/History";
import { Utility } from "./pages/utility/Utility";
import { NotFound } from "./pages/notFound/NotFound";
import { Member } from "./pages/member/Member";
import AdminLayout from "./layouts/AdminLayout";
import { Settings } from "./pages/setting/Settings";
import { SettingsConstant } from "./constants/SettingsPageConstants";
import { UtitilyConstant } from "./constants/UtilityPageConstants";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/member" element={<Member />} />
          <Route path="/room" element={<Room />} />
          <Route path="/setting" element={<Settings />}>
            {
              SettingsConstant.map((item) => (
                <Route 
                  path={item.path}
                  element={item.page}
                />
              ))
            }
          </Route>
          <Route path="/history" element={<History />} />
          <Route path="/utility" element={<Utility />}>
            {
              UtitilyConstant.map((item) => (
                <Route 
                  path={item.path} 
                  element={item.page}
                />
              ))
            }
          </Route>
        </Route>

          {/* Trang 404 */}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App;