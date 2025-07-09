package com.example.backend.board.controller;

import com.example.backend.board.dto.BoardDto;
import com.example.backend.board.dto.BoardListInfo;
import com.example.backend.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("add")
    @ResponseBody
    public ResponseEntity<Object> add(@RequestBody BoardDto dto) {
        // 값들이 유효한지 확인
        boolean result = boardService.validate(dto);

        if (result) {
            // service 에게 넘겨서 일 시키기
            boardService.add(dto);
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "success",
                            "text", "새 글이 저장되었습니다.")));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", Map.of("type", "error",
                            "text", "입력한 내용이 유효하지 않습니다.")));
        }
    }

    @GetMapping("list")
    public List<BoardListInfo> getAllBoards() {

        return boardService.list();
    }

    @GetMapping("{id}")
    public BoardDto getBoardById(@PathVariable Integer id) {
        return boardService.getBoardById(id);
    }
}
