import "../../css/dashboard.css";

import { Switch, Route} from "react-router-dom/cjs/react-router-dom.min";

import SidebarDashboard from "../../components/SidebarDashboard";
import ManagementMovie from "./ManagementMovie";
import ManagementBooking from "../booking/ManagementBooking";
import ManagementCinema from "./ManagementCinema";

function Dashboard() {
  return (
    <>
      <div className="container-fluid dashboard-container">
        <div className="row">
          <div className="col-lg-2">
            <SidebarDashboard />
          </div>
          

          <div className="col-lg-10">
            <Switch>
              <Route exact path="/dashboard" component={ManagementMovie} />
              <Route path="/dashboard/managementMovie" component={ManagementMovie} />
              <Route path="/dashboard/managementBooking" component={ManagementBooking} />
              <Route path="/dashboard/managementCinema" component={ManagementCinema} />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
