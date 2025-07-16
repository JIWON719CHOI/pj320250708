package com.example.backend.board.service;

import com.example.backend.board.dto.BoardAddForm;
import com.example.backend.board.dto.BoardDto;
import com.example.backend.board.dto.BoardListDto;
import com.example.backend.board.entity.Board;
import com.example.backend.board.entity.BoardFile;
import com.example.backend.board.entity.BoardFileId;
import com.example.backend.board.repository.BoardFileRepository;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final BoardFileRepository boardFileRepository;

    public void add(BoardAddForm dto, Authentication authentication) {
        String email = Optional.ofNullable(authentication).filter(Authentication::isAuthenticated).map(Authentication::getName).orElseThrow(() -> new RuntimeException("권한이 없습니다."));

        Member member = memberRepository.findById(email).orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        Board board = new Board();
        board.setTitle(dto.getTitle().trim());
        board.setContent(dto.getContent().trim());
        board.setAuthor(member);
        boardRepository.save(board);

        // file 저장하기
        saveFiles(board, dto);
    }

    private void saveFiles(Board board, BoardAddForm dto) {
        List<MultipartFile> files = dto.getFiles();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file != null && file.getSize() > 0) {
                    // board_file 테이블에 새 레코드 입력
                    BoardFile boardFile = new BoardFile();

                    // entity 내용 채우기
                    BoardFileId id = new BoardFileId();
                    id.setBoardId(board.getId());
                    id.setName(file.getOriginalFilename());
                    boardFile.setBoard(board);
                    boardFile.setId(id);

                    // repository 에 저장
                    boardFileRepository.save(boardFile);

                    /// todo : aws s3 에 저장을 변경할 예정
                    /*
                      실제 파일 disk에 저장 (임시로 로컬에 저장하기 먼저 만듦)
                      1. C:/Temp/prj3/boardFile 에 게시물 번호 폴더 만들고
                      ex) C:/Temp/prj3/boardFile/2002
                    */
                    File folder = new File("C:/Temp/prj3/boardFile/" + board.getId());
                    if (!folder.exists()) {
                        folder.mkdir();
                    }

                    /* 2. 그 폴더에  파일 저장
                    ex) C:/Temp/prj3/boardFile/2002/gojo.jpg
                     */
                    try {
                        BufferedInputStream bi = new BufferedInputStream(file.getInputStream());
                        BufferedOutputStream bo = new BufferedOutputStream(new FileOutputStream(new File(folder, Objects.requireNonNull(file.getOriginalFilename()))));

                        try (bi; bo) {
                            byte[] b = new byte[1024];
                            int len;
                            while ((len = bi.read(b)) != -1) {
                                bo.write(b, 0, len);
                            }
                            bo.flush();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    public void deleteById(Integer id, Authentication authentication) {
        String email = authentication.getName();
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("해당 게시물이 없습니다."));
        if (!board.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("본인 게시물만 삭제할 수 있습니다.");
        }
        commentRepository.deleteByBoardId(id);
        boardRepository.delete(board);
    }

    public void update(BoardDto dto, Authentication authentication) {
        String email = authentication.getName();
        Board board = boardRepository.findById(dto.getId()).orElseThrow(() -> new RuntimeException("해당 게시물이 없습니다."));
        if (!board.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("본인 게시물만 수정할 수 있습니다.");
        }
        board.setTitle(dto.getTitle().trim());
        board.setContent(dto.getContent().trim());
        boardRepository.save(board);
    }

    public boolean validateForAdd(BoardAddForm dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) return false;
        if (dto.getContent() == null || dto.getContent().trim().isBlank()) return false;

        return true;
    }

    public boolean validate(BoardDto dto) {
        return dto.getTitle() != null && !dto.getTitle().trim().isBlank() && dto.getContent() != null && !dto.getContent().trim().isBlank();
    }

    public Map<String, Object> list(String keyword, Integer pageNumber) {
        Page<BoardListDto> boardListDtoPage = boardRepository.findAllBy(keyword, PageRequest.of(pageNumber - 1, 10));

        int totalPages = boardListDtoPage.getTotalPages(); // 마지막 페이지
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        var pageInfo = Map.of("totalPages", totalPages, "rightPageNumber", rightPageNumber, "leftPageNumber", leftPageNumber, "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo, "boardList", boardListDtoPage.getContent());
    }

    public Optional<BoardDto> getBoardById(Integer id) {
        return boardRepository.findById(id).map(b -> {
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

    public List<BoardListDto> getLatestThree() {
        return boardRepository.findAllBy("", PageRequest.of(0, 3)).getContent();
    }
}