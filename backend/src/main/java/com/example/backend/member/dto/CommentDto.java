package com.example.backend.member.dto;

import com.example.backend.comment.entity.Comment;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Integer id;
    private String comment;
    private String authorNickName;
    private String insertedAt;

    // Comment 엔티티 → DTO 변환 생성자 추가
    public CommentDto(Comment comment) {
        this.id = comment.getId();
        this.comment = comment.getComment();
        this.authorNickName = comment.getAuthor().getNickName();

        if (comment.getInsertedAt() != null) {
            // 예: 2025-07-14 15:30 형식으로 변환
            this.insertedAt = comment.getInsertedAt()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        } else {
            this.insertedAt = "";
        }
    }
}
