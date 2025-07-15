package com.example.backend.comment.controller;

import com.example.backend.comment.dto.CommentForm;
import com.example.backend.comment.entity.Comment;
import com.example.backend.comment.service.CommentService;
import com.example.backend.member.dto.CommentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addComment(@RequestBody CommentForm comment,
                                        Authentication authentication) {
        try {
            commentService.add(comment, authentication);
            return ResponseEntity.ok()
                    .body(Map.of("message",
                            Map.of("type", "success",
                                    "text", "새 댓글이 등록되었습니다.")));
        } catch (Exception e) {
            return ResponseEntity.ok()
                    .body(Map.of("message",
                            Map.of("type", "error",
                                    "text", e.getMessage())));
        }

    }

    // 댓글 목록 조회 GET 메서드 추가
    @GetMapping("/list")
    public ResponseEntity<?> listComments(@RequestParam Integer boardId) {
        List<Comment> comments = commentService.findByBoardId(boardId);

        List<CommentDto> commentDtos = comments.stream()
                .map(CommentDto::new)  // Comment → CommentDto 변환
                .toList();

        return ResponseEntity.ok(Map.of("comments", commentDtos));
    }

}