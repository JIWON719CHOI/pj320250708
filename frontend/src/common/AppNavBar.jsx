import { Link, NavLink, useNavigate } from "react-router";
import { Form } from "react-bootstrap";
import {
  Button,
  Container,
  FormControl,
  InputGroup,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useContext, useState } from "react";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";

export function AppNavBar() {
  const { user, isAdmin } = useContext(AuthenticationContext); // ✅ 수정 포인트
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSearchFormSubmit(e) {
    e.preventDefault();
    navigate("/board/list?q=" + encodeURIComponent(keyword));
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container className="flex-grow-1">
          <Navbar.Brand to="/" as={Link} className="fs-3 fw-bold">
            PRJ3
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/board/list">
                게시판
              </Nav.Link>

              {user != null && (
                <Nav.Link as={NavLink} to="/board/add">
                  작성
                </Nav.Link>
              )}

              {isAdmin() && (
                <Nav.Link as={NavLink} to="/member/list">
                  목록
                </Nav.Link>
              )}

              {user == null && (
                <>
                  <Nav.Link as={NavLink} to="/signup">
                    가입
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/login">
                    로그인
                  </Nav.Link>
                </>
              )}

              {user != null && (
                <>
                  <Nav.Link as={NavLink} to="/logout">
                    로그아웃
                  </Nav.Link>
                  <Nav.Link as={NavLink} to={`/member?email=${user.email}`}>
                    {user.nickName}
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Form
              inline="true"
              onSubmit={handleSearchFormSubmit}
              className="order-lg-2 mx-lg-auto"
            >
              <InputGroup>
                <FormControl
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                ></FormControl>
                <Button type="submit">검색</Button>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
