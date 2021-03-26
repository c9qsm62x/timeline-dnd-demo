import React, { useRef, useState } from "react";
import "@royalnavy/css-framework/dist/styles.css";
import "@royalnavy/fonts";
import { TabSet, Tab } from "@royalnavy/react-component-library";

import "./App.css";

import DemoOne from "./Demo1";
import DemoTwo from "./Demo2";
function App() {
  return (
    <TabSet>
      <Tab title="Demo small demo">
        <DemoOne />
      </Tab>
      <Tab title="Data manipulation">
        <DemoTwo />
      </Tab>
    </TabSet>
  );
}

export default App;
