import React, { useEffect } from "react";
import axios from "axios";

function BoardList() {
  useEffect(() => {
    // 마운트 될 때 (initial render 시) 실행되는 코드
    axios
      .get("/api/board/list")
      .then((res) => {
        console.log("GOOD");
      })
      .catch((err) => {
        console.log("ERROR");
      })
      .finally(() => {
        console.log("ALWAYS");
      });
  }, []);
  return (
    <div>
      <h3>게시판</h3>
    </div>
  );
}

export default BoardList;
