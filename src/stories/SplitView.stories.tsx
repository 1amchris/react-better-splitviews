import React from "react";
import { storiesOf } from "@storybook/react";

import { SplitView } from "../components/SplitView";

const stories = storiesOf("App Test", module);

const PlaceholderView = ({ style }: any) => {
  return (
    <div id="container" style={{ padding: "1em", ...style }}>
      <header>This is a view</header>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia unde
        ad quo cumque, maxime vero obcaecati eligendi assumenda velit sequi
        voluptates praesentium tempore itaque adipisci alias odit, nulla aperiam
        laudantium!
      </p>
    </div>
  );
};

stories.add("App", () => {
  return (
    <div style={{ border: "#eee 1px solid", height: "500px" }}>
      <SplitView style={{ background: "white" }}>
        <SplitView style={{ width: "25%" }} direction="column">
          <PlaceholderView style={{ minHeight: 24 }} />
          <PlaceholderView style={{ minHeight: 24, maxHeight: "35%" }} />
          <PlaceholderView style={{ minHeight: 24, maxHeight: "50%" }} />
          <PlaceholderView style={{ minHeight: 24 }} />
        </SplitView>
        <SplitView style={{ minWidth: 100 }} direction="column">
          <SplitView style={{ minWidth: 100 }} direction="row">
            <PlaceholderView style={{ minWidth: 100 }} />
            <PlaceholderView style={{ minWidth: 100, maxWidth: 700 }} />
            <PlaceholderView style={{ minWidth: 100 }} />
          </SplitView>
          <PlaceholderView style={{ height: "25%", maxHeight: "40%" }} />
        </SplitView>
      </SplitView>
    </div>
  );
});
