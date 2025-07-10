import { Outlet } from "react-router";
import { AppNavBar } from "./AppNavBar.jsx";
import { Container } from "react-bootstrap";
import { AppFooter } from "./AppFooter.jsx";

export function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-3">
        <AppNavBar />
      </div>
      <Container className="flex-grow-1" style={{ paddingTop: "80px" }}>
        <Outlet />
      </Container>
      <AppFooter />
    </div>
  );
}
