import { Accordion, Carousel, Tab, Tabs } from "react-bootstrap";
import { useState } from "react";
import { BoardListMini } from "./BoardListMini.jsx";
import img1 from "../../assets/01.png";
import img2 from "../../assets/02.jpg";
import img3 from "../../assets/03.jpg";

export function BoardLayout() {
  const [activeTab, setActiveTab] = useState("2"); // 탭 상태

  return (
    <div>
      {/* Carousel: 이미지 lazy 로딩 및 사이즈 축소 */}
      <Carousel
        className="mb-4"
        style={{ maxHeight: "200px", overflow: "hidden" }}
      >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={img1}
            alt="1번째 슬라이드"
            loading="lazy"
            style={{
              height: "200px",
              objectFit: "cover",
            }}
          />
          <Carousel.Caption>
            <h6>1번째 슬라이드</h6>
            <p className="d-none d-md-block">똥마려워</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={img2}
            alt="2번째 슬라이드"
            loading="lazy"
            style={{
              height: "200px",
              objectFit: "cover",
            }}
          />
          <Carousel.Caption>
            <h6>2번째 슬라이드</h6>
            <p className="d-none d-md-block">피곤하다</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={img3}
            alt="3번째 슬라이드"
            loading="lazy"
            style={{
              height: "200px",
              objectFit: "cover",
            }}
          />
          <Carousel.Caption>
            <h6>3번째 슬라이드</h6>
            <p className="d-none d-md-block">집에갈래</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Tabs: 선택된 탭에만 BoardListMini 렌더링 */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="my-4"
      >
        <Tab eventKey="1" title="공지사항">
          <div className="p-3">공지사항이 없습니다.</div>
        </Tab>
        <Tab eventKey="2" title="최신글">
          <div className="p-3">
            {activeTab === "2" && <BoardListMini />} {/* 선택될 때만 렌더링 */}
          </div>
        </Tab>
      </Tabs>

      {/* Accordion은 트래픽과 무관하므로 유지 */}
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
