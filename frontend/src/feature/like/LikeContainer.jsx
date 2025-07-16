import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";

export function LikeContainer({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  function handleThumbsClick() {
    setIsProcessing(true);
    axios
      .put("/api/like", { boardId: boardId })
      .then((res) => {})
      .catch((err) => console.log(err))
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <div className="d-flex gap-2 h2">
      <div onClick={handleThumbsClick}>
        <FaRegThumbsUp />
        <FaThumbsUp />
      </div>
      <div>9</div>
    </div>
  );
}
