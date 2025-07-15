package com.example.backend.board.service;

import com.example.backend.board.dto.BoardDto;
import com.example.backend.board.dto.BoardListDto;
import com.example.backend.board.entity.Board;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.comment.repository.CommentRepository;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;

    public void add(BoardDto dto, Authentication authentication) {
        String email = Optional.ofNullable(authentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .orElseThrow(() -> new RuntimeException("권한이 없습니다."));

        Member member = memberRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        Board board = new Board();
        board.setTitle(dto.getTitle().trim());
        board.setContent(dto.getContent().trim());
        board.setAuthor(member);
        boardRepository.save(board);
    }

    public boolean validate(BoardDto dto) {
        return dto.getTitle() != null && !dto.getTitle().trim().isBlank()
                && dto.getContent() != null && !dto.getContent().trim().isBlank();
    }

    public Map<String, Object> list(String keyword, Integer pageNumber) {
//        return boardRepository.findAllByOrderByIdDesc();
        Page<BoardListDto> boardListDtoPage
                = boardRepository.findAllBy(keyword, PageRequest.of(pageNumber - 1, 10));

        int totalPages = boardListDtoPage.getTotalPages(); // 마지막 페이지
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        var pageInfo = Map.of("totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo,
                "boardList", boardListDtoPage.getContent());
    }

    public Optional<BoardDto> getBoardById(Integer id) {
        return boardRepository.findById(id)
                .map(b -> {
                    BoardDto dto = new BoardDto();
                    dto.setId(b.getId());
                    dto.setTitle(b.getTitle());
                    dto.setContent(b.getContent());
                    dto.setAuthorEmail(b.getAuthor().getEmail());
                    dto.setAuthorNickName(b.getAuthor().getNickName());
                    dto.setInsertedAt(b.getInsertedAt());
                    return dto;
                });
    }

    public void deleteById(Integer id, Authentication authentication) {
        String email = authentication.getName();
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시물이 없습니다."));
        if (!board.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("본인 게시물만 삭제할 수 있습니다.");
        }
        commentRepository.deleteByBoardId(id);
        boardRepository.delete(board);
    }

    public void update(BoardDto dto, Authentication authentication) {
        String email = authentication.getName();
        Board board = boardRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("해당 게시물이 없습니다."));
        if (!board.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("본인 게시물만 수정할 수 있습니다.");
        }
        board.setTitle(dto.getTitle().trim());
        board.setContent(dto.getContent().trim());
        boardRepository.save(board);
    }
}