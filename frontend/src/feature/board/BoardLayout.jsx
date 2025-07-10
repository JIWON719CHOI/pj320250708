import { Accordion, Carousel, Tab, Tabs } from "react-bootstrap";

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

      <Tabs defaultActiveKey="home" className="my-4">
        <Tab eventKey="notice" title="공지사항">
          <p>뭐뭐뭐</p>
        </Tab>
        <Tab eventKey="new" title="최신글">
          <p>뫄뫄뫄</p>
        </Tab>
      </Tabs>

      <Accordion defaultActiveKey="0" className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>자주 묻는 질문</Accordion.Header>
          <Accordion.Body>
            React-Bootstrap은 Bootstrap 컴포넌트를 React 방식으로 제공합니다.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>사용법은 어렵나요?</Accordion.Header>
          <Accordion.Body>아주 쉽습니다. 그대로 쓰면 돼요.</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
