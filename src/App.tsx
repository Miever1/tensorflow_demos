import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom";

import "./App.css";
import 'antd/dist/antd.css';

import Introduce from "./routes/Introduce";
import LinearRegression from "./routes/LinearRegression";
import HeightWeight from "./routes/HeightWeight";
import LogicRegression from "./routes/LogicRegression";
import XOR from "./routes/XOR";
import Iris from "./routes/Iris";
import Overfit from "./routes/Overfit";
import MNist from "./routes/MNist";
import MobileNet from "./routes/MobileNet";

const funLists = [
  'introduce',
  'linear-regression',
  'height-weight',
  'logic-regression',
  'XOR',
  'iris',
  'overfit',
  'mnist',
  'mobile-net'
];

export const routesList = [
  {
    path: '*',
    element: <Navigate to="/" />
  },
  {
    path: '/',
    element: (
      <ul>
        {funLists.map((path, index) => {
          return (
            <li key={index}>
              <Link to={path}>{path}</Link>
            </li>
          )
        })}
      </ul>
    )
  },
  {
    path: funLists[0],
    element: <Introduce />
  },
  {
    path: funLists[1],
    element: <LinearRegression />
  },
  {
    path: funLists[2],
    element: <HeightWeight />
  },
  {
    path: funLists[3],
    element: <LogicRegression />
  },
  {
    path: funLists[4],
    element: <XOR />
  },
  {
    path: funLists[5],
    element: <Iris />
  },
  {
    path: funLists[6],
    element: <Overfit />
  },
  {
    path: funLists[7],
    element: <MNist />
  },
  {
    path: funLists[8],
    element: <MobileNet />
  }
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routesList.map(({ path, element }) => 
          <Route path={path} element={element} key={`routes_${path}`} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
