function CommentList({ comments = [] }) {
  if (!Array.isArray(comments) || comments.length === 0) {
    return <div className="mt-3 text-muted">아직 댓글이 없습니다.</div>;
  }

  return (
    <div className="mt-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border rounded px-3 py-2 mb-2"
          style={{ backgroundColor: "#f8f9fa", whiteSpace: "pre-wrap" }}
        >
          <strong style={{ fontSize: "0.9rem" }}>
            {comment.authorNickName}
          </strong>{" "}
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            {new Date(comment.insertedAt).toLocaleString()}
          </small>
          <p className="mt-1 mb-0" style={{ fontSize: "0.9rem" }}>
            {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
