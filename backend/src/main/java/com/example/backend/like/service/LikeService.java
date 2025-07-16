package com.example.backend.like.service;

import com.example.backend.board.entity.Board;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.like.dto.LikeForm;
import com.example.backend.like.entity.BoardLike;
import com.example.backend.like.entity.BoardLikeId;
import com.example.backend.like.repository.BoardLikeRepository;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final BoardLikeRepository boardLikeRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public void update(LikeForm likeForm, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인 하세요");
        }

        String email = authentication.getName();
        Integer boardId = likeForm.getBoardId();

        var boardLike = boardLikeRepository.findByBoardIdAndMemberEmail(boardId, email);

        if (boardLike.isPresent()) {
            boardLikeRepository.delete(boardLike.get());
        } else {
            var board = boardRepository.findById(boardId)
                    .orElseThrow(() -> new RuntimeException("게시물 없음"));
            var member = memberRepository.findById(email)
                    .orElseThrow(() -> new RuntimeException("회원 없음"));

            BoardLikeId boardLikeId = new BoardLikeId();
            boardLikeId.setBoardId(boardId);
            boardLikeId.setMemberEmail(email);

            BoardLike newLike = new BoardLike();
            newLike.setId(boardLikeId);
            newLike.setBoard(board);
            newLike.setMember(member);

            boardLikeRepository.save(newLike);
        }
    }

    public int count(Integer boardId) {
        return boardLikeRepository.countByBoard_Id(boardId);
    }
}
