import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  function handleSaveButtonClick() {
    setIsProcessing(true);
    axios
      .post("/api/board/add", { title, content, author })
      .then((res) => {
        const message = res.data.message;
        // toast 띄우기
        if (message) {
          toast(message.text, { type: message.type });
        }
        // list 로 이동
        navigate("/board/list");
      })
      .catch((err) => {
        const message = err.response.data.message;
        if (message) {
          // toast!
          toast(message.text, { type: message.type });
        }
      })
      .finally(() => {
        console.log("ALWAYS");
        setIsProcessing(false);
      });
  }

  // 작성자, 제목, 본문 썼는지
  let validate = true;
  if (title.trim() === "") {
    validate = false;
  } else if (content.trim() === "") {
    validate = false;
  } else if (author.trim() === "") {
    validate = false;
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">글 작성</h2>
        <div>
          <FormGroup className="mb-3" controlId="title1">
            <FormLabel>제목</FormLabel>
            <FormControl
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></FormControl>
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="content1">
            <FormLabel>본문</FormLabel>
            <FormControl
              as="textarea"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="author1">
            <FormLabel>작성자</FormLabel>
            <FormControl
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </FormGroup>
        </div>
        <div className="mb-3">
          <Button
            onClick={handleSaveButtonClick}
            disabled={isProcessing || !validate}
          >
            {isProcessing && <Spinner />}
            {isProcessing || "저장"}
          </Button>
        </div>
      </Col>
    </Row>
  );
}
