import { useEffect, useRef, useState } from "react";
import {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    getTimerStatus,
    getTimerRecords,
    getDailySummary,
} from "../api/timerApi";
import TimerDisplay from "../components/TimerDisplay";
import TimerControls from "../components/TimerControls";
import TimerRecordList from "../components/TimerRecordList";
import type { TimerRecord } from "../types/timer";
import ManualTimerForm from "../components/ManualTimerForm.tsx";
import {useNavigate} from "react-router-dom";

/** =========================
 * 메인 TimerPage
 * ========================= */
const TimerPage = () => {
    /** =========================
     * 1️⃣ 기본 설정
     * ========================= */
    const subjectId = 1; // TODO: 나중에 과목 선택 기능 추가 예정
    // TODO: 나중에 하드코딩 제거 후 selectBox로 과목 선택 가능

    // 페이지 이동
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    /** =========================
     * 2️⃣ 상태 관리
     * ========================= */
    const [elapsed, setElapsed] = useState<number>(0); // 현재 경과 시간 (초)
    const [running, setRunning] = useState<boolean>(false); // 타이머 실행 여부
    const [records, setRecords] = useState<TimerRecord[]>([]); // 오늘 기록 리스트
    const [summary, setSummary] = useState<number>(0); // 오늘 총 공부 시간
    const [showManualForm, setShowManualForm] = useState<boolean>(false); // 수동 기록 폼 표시 여부

    /** =========================
     * 3️⃣ interval 참조 저장
     * ========================= */
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

    /** =========================
     * 4️⃣ 오늘 기록 및 총합 조회
     * ========================= */
    const fetchRecords = async () => {
        const list = await getTimerRecords(today);
        const sum = await getDailySummary(today);
        setRecords(list);
        setSummary(sum.totalDuration);
    };

    /** =========================
     * 5️⃣ 페이지 진입 시 상태 복구
     * ========================= */
    useEffect(() => {
        const init = async () => {
            const status = await getTimerStatus(subjectId);
            setElapsed(status.elapsed);
            setRunning(status.running);
            if (status.running) startInterval();
            await fetchRecords();
        };

        init();
        return () => stopInterval();
    }, [subjectId]);

    /** =========================
     * 6️⃣ 이벤트 핸들러
     * ========================= */
    const handleStart = async () => {
        await startTimer(subjectId);
        setRunning(true);
        startInterval();
    };

    const handlePause = async () => {
        await pauseTimer(subjectId);
        setRunning(false);
        stopInterval();
    };

    const handleResume = async () => {
        await resumeTimer(subjectId);
        setRunning(true);
        startInterval();
    };

    const handleStop = async () => {
        await stopTimer(subjectId);
        setRunning(false);
        stopInterval();
        setElapsed(0);
        await fetchRecords(); // 종료 후 기록 갱신
    };

    /** =========================
     * 7️⃣ 화면 렌더링
     * ========================= */
    return (
        <div style={{ padding: "20px" }}>
            {/* 뒤로가기 버튼 */}
            <button onClick={handleBack}>
                ← 뒤로가기
            </button>
            <h2>📚 타이머</h2>

            {/* 시간 표시 */}
            <TimerDisplay elapsed={elapsed} />

            {/* 제어 버튼 */}
            <TimerControls
                running={running}
                elapsed={elapsed}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onStop={handleStop}
            />

            {/* 수동 학습 기록 폼 토글 버튼 */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => setShowManualForm((prev) => !prev)}>
                    {showManualForm ? "수동 기록 닫기" : "수동 학습 기록 추가"}
                </button>
            </div>

            {/* 조건부 렌더링: 수동 학습 기록 폼 */}
            {showManualForm && (
                <ManualTimerForm subjectId={subjectId} onAdd={fetchRecords} />
            )}

            {/* 기록 리스트 */}
            <TimerRecordList records={records} summary={summary} />
        </div>
    );
};

export default TimerPage;
