package com.example.backend.board.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;

@AllArgsConstructor
@NoArgsConstructor // ✅ 꼭 있어야 함
@Getter
public class BoardListDto {
    private Integer id;
    private String title;
    private String author; // 👈 변경
    private LocalDateTime insertedAt;

    public String getTimesAgo() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDateTime insertedAt = this.getInsertedAt();

        Duration duration = Duration.between(insertedAt, now);

        long seconds = duration.toSeconds();

        if (seconds < 60) {
            return "방금 전";
        } else if (seconds < 60 * 60) { // 1 시간
            long minutes = seconds / 60;
            return minutes + "분 전";
        } else if (seconds < 60 * 60 * 24) { // 1 일
            long hours = seconds / 3600;
            return hours + "시간 전";
        } else if (seconds < 60 * 60 * 24 * 7) { // 1주일
            long days = seconds / 3600 / 24;
            return days + "일 전";
        } else if (seconds < 60 * 60 * 24 * 7 * 4) { // 4주
            long weeks = seconds / 3600 / 24 * 7;
            return weeks + "주 전";
        } else {
            long days = duration.toDays();
            long years = days / 365;
            return years + "년 전";
        }
    }
}