package com.example.backend.board.repository;

import com.example.backend.board.dto.BoardDto;
import com.example.backend.board.dto.BoardListDto;
import com.example.backend.board.dto.BoardListInfo;
import com.example.backend.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {
    List<BoardListInfo> findAllByOrderByIdDesc();

    @Query(value = """
                SELECT b.id AS id,
                       b.title AS title,
                       b.inserted_at AS insertedAt,
                       m.nick_name AS author
                FROM board b
                JOIN member m ON b.author = m.email
                ORDER BY b.id DESC
            """, nativeQuery = true)
    List<BoardListDto> findAllBy();


    @Query(value = """
            SELECT b.id id, b.title title, b.inserted_at inserted_at, m.email author_email, m.nick_name author_nick_name 
                        FROM board b JOIN member m 
                                        ON b.author = m.email 
                                    WHERE b.id = :id
            """, nativeQuery = true)
    BoardDto findBoardByID(Integer id);
}