package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.*;
import com.example.demo.domain.timeschedule.entity.TermRequestStatus;

import java.util.List;

/**
 * 차수 변경/삭제 요청 서비스 인터페이스
 */
public interface CourseTermRequestService {

    // ===== 변경 요청 (TS-015) =====

    /**
     * 변경 요청 생성
     */
    ChangeRequestResponse createChangeRequest(Long requesterId, CreateChangeRequestDto dto);

    /**
     * 내 변경 요청 목록 조회
     */
    List<ChangeRequestResponse> getMyChangeRequests(Long requesterId);

    /**
     * 변경 요청 취소
     */
    void cancelChangeRequest(Long requesterId, Long requestId);

    // ===== 삭제 요청 (TS-016) =====

    /**
     * 삭제 요청 생성
     */
    DeleteRequestResponse createDeleteRequest(Long requesterId, CreateDeleteRequestDto dto);

    /**
     * 내 삭제 요청 목록 조회
     */
    List<DeleteRequestResponse> getMyDeleteRequests(Long requesterId);

    /**
     * 삭제 요청 취소
     */
    void cancelDeleteRequest(Long requesterId, Long requestId);

    // ===== Admin 요청 관리 (TS-017) =====

    /**
     * 요청 목록 조회 (변경+삭제 통합)
     */
    List<TermRequestListResponse> getAllRequests(TermRequestStatus status, String type);

    /**
     * 변경 요청 상세 조회
     */
    ChangeRequestResponse getChangeRequestDetail(Long requestId);

    /**
     * 삭제 요청 상세 조회
     */
    DeleteRequestResponse getDeleteRequestDetail(Long requestId);

    /**
     * 변경 요청 승인
     */
    ChangeRequestResponse approveChangeRequest(Long processorId, Long requestId);

    /**
     * 변경 요청 반려
     */
    ChangeRequestResponse rejectChangeRequest(Long processorId, Long requestId, RejectRequestDto dto);

    /**
     * 삭제 요청 승인
     */
    DeleteRequestResponse approveDeleteRequest(Long processorId, Long requestId);

    /**
     * 삭제 요청 반려
     */
    DeleteRequestResponse rejectDeleteRequest(Long processorId, Long requestId, RejectRequestDto dto);
}
