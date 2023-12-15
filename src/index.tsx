import { GlobalStyles } from "@contentful/f36-components";
import { SDKProvider } from "@contentful/react-apps-toolkit";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import LocalhostWarning from "./components/LocalhostWarning";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById(`root`)!;

const root = createRoot(container);

if (process.env.NODE_ENV === `development` && window.self === window.top) {
  // You can remove this if block before deploying your app
  root.render(<LocalhostWarning />);
} else {
  root.render(
    <SDKProvider>
      <GlobalStyles />
      <App />
    </SDKProvider>,
  );
}
