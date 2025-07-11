import { Accordion, Carousel, Tab, Tabs } from "react-bootstrap";
import { BoardListMini } from "./BoardListMini.jsx";

export function BoardLayout() {
  return (
    <div>
      <Carousel className="mb-5">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://picsum.photos/id/1011/800/300"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>첫 번째 슬라이드</h3>
            <p>똥마려워</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://picsum.photos/id/1015/800/300"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>두 번째 슬라이드</h3>
            <p>피곤하다</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://picsum.photos/id/1025/800/300"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>세 번째 슬라이드</h3>
            <p>집에갈래</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Tabs defaultActiveKey="2" className="my-4">
        <Tab eventKey="1" title="공지사항">
          <p>뭐뭐뭐</p>
        </Tab>
        <Tab eventKey="2" title="최신글">
          <BoardListMini />
        </Tab>
      </Tabs>

      <Accordion defaultActiveKey="0" className="my-3">
        <Accordion.Item eventKey="1">
          <Accordion.Header>지금 피곤한가요?</Accordion.Header>
          <Accordion.Body>네.</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>집에 가고싶나요?</Accordion.Header>
          <Accordion.Body>네.</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
