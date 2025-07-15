package com.example.backend.comment.repository;

import com.example.backend.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByBoardId(Integer boardId);

    void deleteByBoardId(Integer id);
}