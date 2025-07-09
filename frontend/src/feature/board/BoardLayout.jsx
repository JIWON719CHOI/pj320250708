import { Carousel } from "react-bootstrap";

export function BoardLayout() {
  return (
    <div>
      <h3>HOME</h3>

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
    </div>
  );
}
