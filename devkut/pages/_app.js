import { createGlobalStyle, ThemeProvider } from "styled-components";
import { AlurakutStyles } from '../src/lib/AlurakutCommons'
const theme = {
  colors: {
    primary: "#0070f3",
    secondary: "#D9E6F6",
  },
};

const GlobalStyle = createGlobalStyle`
  *{
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: serif;    
    background-color:${(props) => props.theme.colors.secondary};
  }

  #__next{
    display:flex;
    min-height: 100vh;
    flex-direction: column;
  }

  img{
    max-width:100%;
    height: auto;
    display:block;
  }

  ${AlurakutStyles}

`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle theme={theme} />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
