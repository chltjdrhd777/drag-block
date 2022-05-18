import { Global, css } from '@emotion/react';

const globalCSS = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  body {
    font-size: 1.6rem;
    font-family: 'Roboto', sans-serif;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
  }
  a {
    text-decoration: none;
    color: black;
  }
  ul {
    list-style-type: none;
  }
  img {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  button {
    border: none;
    background-color: transparent;
    border-radius: 1rem;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  input {
    outline: none;
    &:focus::placeholder {
      color: transparent;
    }
  }
`;

function GlobalStyle() {
  return <Global styles={globalCSS} />;
}

export default GlobalStyle;
