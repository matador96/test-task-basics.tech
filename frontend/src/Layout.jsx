import React from "react";
import Header from "./components/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Toaster } from "react-hot-toast";

export const ContainerComponent = ({ children }) => (
  <Container maxWidth="lg">{children}</Container>
);

const LayoutComponent = (props) => (
  <div>
    <Toaster />
    <Header />
    <Box mt={2}>
      <ContainerComponent>{props.children}</ContainerComponent>
    </Box>
  </div>
);

export default LayoutComponent;
