package com.example.backend.board.repository;

import com.example.backend.board.dto.BoardListDto;
import com.example.backend.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {
    @Query("""
                SELECT new com.example.backend.board.dto.BoardListDto(
                    b.id,
                    b.title,
                    b.author.nickName,
                    b.insertedAt
                )
                FROM Board b
                ORDER BY b.id DESC
            """)
    List<BoardListDto> findAllBy();
}
