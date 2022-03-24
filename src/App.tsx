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
    path: 'test',
    element: <Test />
  },
  {
    path: 'linear-regression',
    element: <LinearRegression />
  },
  {
    path: 'height-weight',
    element: <HeightWeight />
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
