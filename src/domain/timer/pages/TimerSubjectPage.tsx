// src/domain/timer/pages/TimerSubjectPage.tsx

import { useEffect, useRef, useState } from "react";
import {startTimer, pauseTimer, resumeTimer, stopTimer, getTimerStatus, getTimerRecords,} from "../api/timerApi";
import TimerDisplay from "../components/TimerDisplay";
import TimerControls from "../components/TimerControls";
import TimerRecordList from "../components/TimerRecordList";
import type { TimerRecord } from "../types/timer";
import ManualTimerForm from "../components/ManualTimerForm.tsx";
import { useNavigate, useParams } from "react-router-dom";

const TimerSubjectPage = () => {

    // subjectId 가져오기
    const { subjectId } = useParams();
    const parsedSubjectId = Number(subjectId);

    // 페이지 이동
    const navigate = useNavigate();

    /**
     * 상태 관리
     * */
    // 현재 경과 시간 (초단위)
    const [elapsed, setElapsed] = useState<number>(0);
    // 타이머 실행 여부
    const [running, setRunning] = useState<boolean>(false);
    // 오늘 기록 리스트
    const [records, setRecords] = useState<TimerRecord[]>([]);
    // 수동 기록 폼 표시 여부
    const [showManualForm, setShowManualForm] = useState<boolean>(false);

    /**
     * interval 참조 저장
     * */
    const intervalRef = useRef<number | null>(null);
    const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd

    const startInterval = () => {
        if (intervalRef.current !== null) return;

        intervalRef.current = window.setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
    };

    const stopInterval = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    /**
     * 오늘 기록 조회
     * */
    const fetchRecords = async () => {
        const list = await getTimerRecords(today);
        setRecords(list);
    };

    /**
     * 페이지 이동 시 상태 복구
     * */
    useEffect(() => {
        const init = async () => {
            if (!parsedSubjectId) return;
            const status = await getTimerStatus(parsedSubjectId);

            setElapsed(status.elapsed);
            setRunning(status.running);

            if (status.running) startInterval();
            await fetchRecords();
        };
        init();
        return () => stopInterval();
    }, [parsedSubjectId]);

    /**
     * 이벤트 핸들러
     * */
    // 시작
    const handleStart = async () => {
        if (!parsedSubjectId) return;

        await startTimer(parsedSubjectId);

        setRunning(true);
        startInterval();
    };
    // 일시정지
    const handlePause = async () => {
        if (!parsedSubjectId) return;

        await pauseTimer(parsedSubjectId);

        setRunning(false);
        stopInterval();
    };

    // 재개
    const handleResume = async () => {
        if (!parsedSubjectId) return;

        await resumeTimer(parsedSubjectId);

        setRunning(true);
        startInterval();
    };

    // 중지
    const handleStop = async () => {
        if (!parsedSubjectId) return;

        await stopTimer(parsedSubjectId);

        setRunning(false);
        stopInterval();
        setElapsed(0);

        await fetchRecords(); // 종료 후 기록 갱신
    };

    /**
     * 과목별 기록
     * */
    const subjectRecords = records.filter(
        r => r.subjectId === parsedSubjectId
    );

    const subjectSummary = subjectRecords.reduce(
        (sum, r) => sum + r.duration,
        0
    );

    return (
        <div className="timer-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>타이머</h2>
                <div style={{ width:40 }} />
            </header>

            <div className="p-3 mx-auto" style={{ maxWidth: "40rem" }}>

                {/* 타이머 카드 */}
                <div className="card text-center mb-4 border-0">
                    <div className="card-body text-white py-5 rounded" style={{ backgroundColor: "#5c9edc" }}>
                        <TimerDisplay elapsed={elapsed} />
                    </div>
                </div>

                {/* 제어 버튼 */}
                <div className="d-flex justify-content-center mb-3">
                    <TimerControls
                        running={running}
                        elapsed={elapsed}
                        onStart={handleStart}
                        onPause={handlePause}
                        onResume={handleResume}
                        onStop={handleStop}/>
                </div>

                {/* 수동 기록 버튼 */}
                <div className="mb-3 text-center">
                    <button className="btn btn-outline-secondary"
                        onClick={() => setShowManualForm((prev) => !prev)}>
                        {showManualForm ? "수동 기록 닫기" : "수동 학습 기록 추가"}
                    </button>
                </div>

                {/* 조건부 렌더링 : 수동 학습 기록 폼 */}
                {showManualForm && (
                    <ManualTimerForm
                        subjectId={parsedSubjectId}
                        onAdd={fetchRecords}/>
                )}

                {/* 기록 카드 */}
                <div className="card mt-4 border-0 bg-light">
                    <div className="card-body">
                        <TimerRecordList
                            records={subjectRecords}
                            summary={subjectSummary}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimerSubjectPage;