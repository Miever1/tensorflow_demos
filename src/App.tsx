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

import Test from "./routes/Test";
import LinearRegression from "./routes/LinearRegression";
import HeightWeight from "./routes/HeightWeight";
import LogicRegression from "./routes/LogicRegression";

const funLists = ['test', 'linear-regression', 'height-weight', 'logic-regression'];

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
    element: <Test />
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
