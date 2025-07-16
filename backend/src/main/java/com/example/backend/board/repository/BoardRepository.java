package com.example.backend.board.repository;

import com.example.backend.board.dto.BoardListDto;
import com.example.backend.board.entity.Board;
import com.example.backend.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface BoardRepository extends JpaRepository<Board, Integer> {

    @Query(value = """
            SELECT new com.example.backend.board.dto.BoardListDto(
                        b.id,
                        b.title,
                        m.nickName,
                        b.insertedAt,
                        COUNT(DISTINCT c),
                        COUNT(DISTINCT l))
            FROM Board b JOIN Member m
                        ON b.author.email = m.email
                        LEFT JOIN Comment c
                        ON b.id = c.board.id
                        LEFT JOIN BoardLike l
                        ON b.id = l.board.id
            WHERE b.title LIKE %:keyword%
               OR b.content LIKE %:keyword%
               OR m.nickName LIKE %:keyword%
            GROUP BY b.id
            ORDER BY b.id DESC
            """)
    Page<BoardListDto> findAllBy(String keyword, PageRequest pageRequest);


    @Modifying
    @Transactional
    @Query("DELETE FROM Board b WHERE b.author = :author")
    void deleteByAuthor(Member author);
}
