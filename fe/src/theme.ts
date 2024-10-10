// theme.ts
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/roboto";

const customTheme = extendTheme({
  fonts: {
    body: `'Roboto', 'sans-serif'`,
  },
  components: {
    // Customize the default props for the Toast component
    Toast: {
      baseStyle: {
        container: {
          padding: 4,
          borderRadius: "md",
        },
      },
      defaultProps: {
        variant: "solid", // Variant for all toasts
      },
      variants: {
        solid: (props: any) => {
          const { status } = props;
          switch (status) {
            case "success":
              return {
                container: {
                  bg: "teal",
                  color: "white",
                },
              };
            case "error":
              return {
                container: {
                  bg: "red.500",
                  color: "white",
                },
              };
            default:
              return {
                container: {
                  bg: "teal",
                  color: "white",
                },
              };
          }
        },
      },
    },
  },
});

export default customTheme;
