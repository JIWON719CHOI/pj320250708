import { useContext, useState } from "react";
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
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  function handleSaveButtonClick() {
    if (!validate) {
      toast.warning("제목과 본문을 입력하세요.");
      return;
    }

    setIsProcessing(true);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // files 배열을 FormData에 append
    files.forEach((file) => {
      formData.append("files", file);
    });

    // 백엔드 주소 맞춰서 수정하세요 (예: localhost:8080)
    axios
      .post("/api/board/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const message = res.data?.message;
        if (message) {
          toast(message.text, { type: message.type });
        } else {
          toast.success("게시글이 등록되었습니다.");
        }
        navigate("/board/list");
      })
      .catch((err) => {
        const message = err.response?.data?.message;
        if (message) {
          toast(message.text, { type: message.type });
        } else {
          toast.error("오류가 발생했습니다.");
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  // 작성자, 제목, 본문 썼는지
  let validate = true;
  if (title.trim() === "") {
    validate = false;
  } else if (content.trim() === "") {
    validate = false;
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h4 className="mb-4" style={{ fontWeight: "600" }}>
          글 작성
        </h4>
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
          <FormGroup className="me-3" controlId="files1">
            <FormLabel>파일 첨부</FormLabel>
            <FormControl
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />
          </FormGroup>
        </div>
        <br />
        <div>
          <FormGroup className="mb-3" controlId="author1">
            <FormLabel>작성자</FormLabel>
            <FormControl value={user.nickName} disabled />
          </FormGroup>
        </div>
        <div className="mb-3">
          <Button
            onClick={handleSaveButtonClick}
            disabled={isProcessing || !validate}
          >
            {isProcessing && <Spinner size="sm" />}
            {isProcessing || "저장"}
          </Button>
        </div>
      </Col>
    </Row>
  );
}
