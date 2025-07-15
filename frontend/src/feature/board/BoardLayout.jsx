import { Accordion, Carousel, Tab, Tabs } from "react-bootstrap";
import { useState } from "react";
import { BoardListMini } from "./BoardListMini.jsx";

export function BoardLayout() {
  const [activeTab, setActiveTab] = useState("2"); // 탭 상태

  return (
    <div>
      {/* Carousel: 이미지 lazy 로딩 및 사이즈 축소 */}
      <Carousel className="mb-5">
        {[1011, 1015, 1025].map((id, index) => (
          <Carousel.Item key={id}>
            <img
              className="d-block w-100"
              src={`https://picsum.photos/id/${id}/800/200`} // 세로 크기 줄임
              alt={`${index + 1}번째 슬라이드`}
              loading="lazy"
            />
            <Carousel.Caption>
              <h5>{index + 1}번째 슬라이드</h5>
              <p>{["똥마려워", "피곤하다", "집에갈래"][index]}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
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
      <Accordion defaultActiveKey="1" className="my-3">
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
