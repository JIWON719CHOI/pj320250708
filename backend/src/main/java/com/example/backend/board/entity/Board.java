package com.example.backend.board.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "board")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가
    private Integer id;

    private String title;
    private String content;
    private String author;

    @Column(updatable = false, insertable = false) // 생성 시각 자동 default NOW();
    private LocalDateTime insertedAt;
}
