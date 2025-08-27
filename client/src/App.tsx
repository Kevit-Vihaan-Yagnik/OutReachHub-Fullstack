import { createTheme, MantineProvider } from "@mantine/core";
import { Router } from "./app/router"
import '@mantine/core/styles.css';

const theme = createTheme({

})

function App() {

  return (
    <>
      <MantineProvider theme={theme}>
        <Router />
      </MantineProvider>
    </>
  )
}

export default App
