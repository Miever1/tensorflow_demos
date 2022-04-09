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

const funLists = [
  'introduce',
  'linear-regression',
  'height-weight',
  'logic-regression',
  'XOR',
  'iris',
  'overfit',
  'mnist'
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
        {['test', 'linear-regression', 'height-weight'].map((path, index) => {
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
    path: 'linear-regression',
    element: <LinearRegression />
  },
  {
    path: 'height-weight',
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
