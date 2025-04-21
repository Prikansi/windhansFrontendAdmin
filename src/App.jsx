import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Blogwrap from './partials/Blog/Blogwrap';
import Teamwrap from './partials/Team/Teamwrap';
import Careerwrap from './partials/Career/Careerwrap';
// import Sliderwrap from './partials/Slider/Sliderwrap';
import JobApplywrap from './partials/jobApply/jobApplywrap';

import Loginwrap from './partials/Authentication/Loginwrap';
//import Login from './partials/Authentication/Login';
import Contactwrap from './partials/Contact/Contactwrap';
import ConsultWrap from './partials/Consult/ConsultWrap';
import SolutionListwrap from './partials/SolutionList/SolutionListwrap';
import SolDetwrap from './partials/SolDet/SolDetwrap';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/" element={<Loginwrap />} />
        <Route exact path="/blog" element={<Blogwrap />} />
        <Route exact path="/team" element={<Teamwrap />} />
        <Route exact path="/career" element={<Careerwrap />} />
        <Route exact path="/jobApply" element={<JobApplywrap/>} />
        {/* <Route exact path="/Slider" element={<Sliderwrap />} /> */}
        <Route exact path="/Contact" element={<Contactwrap />} />
        <Route exact path="/Consult" element={<ConsultWrap />} />
        <Route exact path="/SolutionList" element={<SolutionListwrap />} />
        <Route exact path="/SolDet" element={<SolDetwrap/>} />

      </Routes>

    </> 
  );
}

export default App;
