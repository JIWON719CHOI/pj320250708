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
import com.example.backend.like.repository.BoardLikeRepository;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final BoardFileRepository boardFileRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final CommentRepository commentRepository;

    public void add(BoardAddForm dto, Authentication authentication) {
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

        saveFiles(board, dto);
    }

    private void saveFiles(Board board, BoardAddForm dto) {
        List<MultipartFile> files = dto.getFiles();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file != null && file.getSize() > 0) {
                    BoardFile boardFile = new BoardFile();
                    BoardFileId id = new BoardFileId();
                    id.setBoardId(board.getId());
                    id.setName(file.getOriginalFilename());
                    boardFile.setBoard(board);
                    boardFile.setId(id);
                    boardFileRepository.save(boardFile);

                    File folder = new File("C:/Temp/prj3/boardFile/" + board.getId());
                    if (!folder.exists()) {
                        folder.mkdirs();
                    }

                    try {
                        File outputFile = new File(folder, Objects.requireNonNull(file.getOriginalFilename()));
                        try (BufferedInputStream bi = new BufferedInputStream(file.getInputStream());
                             BufferedOutputStream bo = new BufferedOutputStream(new FileOutputStream(outputFile))) {

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

    public void updateWithFiles(Integer id, BoardAddForm dto, List<String> deleteFileNames, Authentication authentication) {
        String email = authentication.getName();
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시물이 없습니다."));

        if (!board.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("본인 게시물만 수정할 수 있습니다.");
        }

        // 제목/본문 수정
        board.setTitle(dto.getTitle().trim());
        board.setContent(dto.getContent().trim());

        boardRepository.save(board);

        // ✅ 1. 삭제할 파일 DB, 로컬에서 제거
        if (deleteFileNames != null && !deleteFileNames.isEmpty()) {
            for (String fileName : deleteFileNames) {
                // 복합키 객체 생성
                BoardFileId fileId = new BoardFileId();
                fileId.setBoardId(id);
                fileId.setName(fileName);

                // DB 삭제
                boardFileRepository.deleteById(fileId);

                // 로컬 파일 삭제
                File target = new File("C:/Temp/prj3/boardFile/" + id + "/" + fileName);
                if (target.exists()) {
                    target.delete();
                }
            }
        }

        // ✅ 2. 새로 업로드된 파일 저장
        saveFiles(board, dto);
    }

    public void deleteById(Integer id, Authentication authentication) {
        String email = authentication.getName();
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시물이 없습니다."));

        if (!board.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("본인만 삭제할 수 있습니다.");
        }

        // ✅ 댓글 먼저 삭제
        commentRepository.deleteByBoardId(id);  // 게시물에 달린 댓글 삭제

        // ✅ 좋아요 삭제
        boardLikeRepository.deleteByBoardId(id);  // 게시글을 참조하는 좋아요 삭제

        // ✅ 첨부파일 실제 파일 삭제
        for (BoardFile file : board.getFiles()) {
            File target = new File("C:/Temp/prj3/boardFile/" + id + "/" + file.getId().getName());
            if (target.exists()) {
                boolean deleted = target.delete();
                System.out.println("파일 삭제: " + file.getId().getName() + " => " + deleted);
            }
        }

        // ✅ 폴더 자체도 삭제 시도 (비어있을 경우)
        File dir = new File("C:/Temp/prj3/boardFile/" + id);
        if (dir.exists() && dir.isDirectory()) {
            dir.delete(); // 내부 비어 있을 경우만 성공
        }

        // ✅ 게시글 삭제 (파일, 댓글 등 cascade 삭제 포함)
        boardRepository.delete(board);
    }

    public boolean validateForAdd(BoardAddForm dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) return false;
        if (dto.getContent() == null || dto.getContent().trim().isBlank()) return false;
        return true;
    }

    public Map<String, Object> list(String keyword, Integer pageNumber) {
        Page<BoardListDto> boardListDtoPage = boardRepository.findAllBy(keyword, PageRequest.of(pageNumber - 1, 10));

        int totalPages = boardListDtoPage.getTotalPages();
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        var pageInfo = Map.of(
                "totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber
        );

        return Map.of(
                "pageInfo", pageInfo,
                "boardList", boardListDtoPage.getContent()
        );
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

            List<String> fileUrls = b.getFiles().stream()
                    .map(f -> "http://localhost:8080/boardFile/" + b.getId() + "/" + f.getId().getName())
                    .collect(Collectors.toList());
            dto.setFiles(fileUrls);

            return dto;
        });
    }

    public List<BoardListDto> getLatestThree() {
        return boardRepository.findAllBy("", PageRequest.of(0, 3)).getContent();
    }
}
