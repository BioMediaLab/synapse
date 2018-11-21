import { SheetsRegistry, GenerateClassName } from "jss";
import {
  createMuiTheme,
  createGenerateClassName,
  Theme,
} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";

interface IProc {
  browser: boolean;
}
declare var process: IProc;

export interface IPageContext {
  theme: Theme;
  sheetsManager: Map<any, any>;
  sheetsRegistry: SheetsRegistry;
  generateClassName: GenerateClassName;
}
interface IGlobal {
  __INIT_MATERIAL_UI__?: IPageContext;
}
declare var global: IGlobal;

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[300],
      main: "#2948ff",
      dark: blue[700],
    },
    secondary: {
      light: pink[300],
      main: pink[500],
      dark: pink[700],
    },
    background: {
      default: "#FFFFFF",
    },
  },
  zIndex: {
    drawer: 1200,
  },
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function createPageContext(): IPageContext {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getPageContext(): IPageContext {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
