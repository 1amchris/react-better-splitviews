import React, { useCallback } from "react";
import { storiesOf } from "@storybook/react";

import SplitView from "../";

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

function getGenericHandleHandlers(handlerType: string) {
  return {
    onGrabHandle: useCallback(() => {
      console.log(`Grab Handle Handler: ${handlerType}`);
    }, []),
    onDragHandle: useCallback(() => {
      console.log(`Drag Handle Handler: ${handlerType}`);
    }, []),
    onReleaseHandle: useCallback(() => {
      console.log(`Release Handle Handler: ${handlerType}`);
    }, []),
  };
}

stories.add("App", () => {
  return (
    <div style={{ border: "#eee 1px solid", height: "500px" }}>
      <SplitView
        style={{ background: "white" }}
        {...getGenericHandleHandlers("app")}
      >
        <SplitView
          style={{ width: "25%" }}
          direction="column"
          {...getGenericHandleHandlers("sidebar")}
        >
          <PlaceholderView style={{ minHeight: 24 }} />
          <PlaceholderView style={{ minHeight: 24, maxHeight: "35%" }} />
          <PlaceholderView style={{ minHeight: 24, maxHeight: "50%" }} />
          <PlaceholderView style={{ minHeight: 24 }} />
        </SplitView>
        <SplitView
          style={{ minWidth: 100 }}
          direction="column"
          {...getGenericHandleHandlers("main")}
        >
          <SplitView
            style={{ minWidth: 100 }}
            direction="row"
            // {...getGenericHandleHandlers("editor groups")}
          >
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
