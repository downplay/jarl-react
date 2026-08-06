import React from "react";
import { createRoot } from "react-dom/client";

import "semantic-ui-css/semantic.min.css";

import Root from "./Root";

const container = document.getElementById("root");
createRoot(container).render(<Root />);
