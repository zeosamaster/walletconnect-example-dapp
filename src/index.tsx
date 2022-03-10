import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import { NewApp } from "./NewApp";
import { globalStyle } from "./styles";
const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

declare global {
  // tslint:disable-next-line
  interface Window {
    blockies: any;
  }
}

ReactDOM.render(
  <>
    <GlobalStyle />
    <NewApp />
  </>,
  document.getElementById("root"),
);
