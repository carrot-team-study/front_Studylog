// src/domain/timer/pages/TimerHomePage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { subjectApi } from "../../subject/api/subjectApi";
import type { Subject } from "../../subject/types/subject";

import { getTimerRecords, getDailySummary } from "../api/timerApi";
import type { TimerRecord } from "../types/timer";

import { formatDuration } from "../../../global/utils/timerUtil";

const TimerHomePage = () => {

    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    /**
     * 상태 관리
     * */
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [records, setRecords] = useState<TimerRecord[]>([]);
    const [summary, setSummary] = useState<number>(0);

    /**
     * 데이터 조회
     * */
    useEffect(() => {

        const init = async () => {
            // 과목
            const subjectList = await subjectApi.getAll();
            setSubjects(subjectList);
            // 기록
            const recordList = await getTimerRecords(today);
            setRecords(recordList);
            // 요약
            const sum = await getDailySummary(today);
            setSummary(sum.totalDuration);
        };
        init();
    }, []);

    /**
     * 과목별 공부시간 계산
     * */
    const getSubjectTime = (subjectId: number) => {
        const total = records
            .filter(r => r.subjectId === subjectId)
            .reduce((sum, r) => sum + r.duration, 0);
        return total;
    };

    return (
        <div className="timer-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>타이머</h2>
                <div style={{ width:40 }} />
            </header>

            <div className="p-3 mx-auto" style={{ maxWidth: "40rem" }}>

                {/* 오늘 총 공부시간 */}
                <div className="card text-center mb-4 border-0">
                    <div className="card-body text-white py-5 rounded" style={{ backgroundColor: "#5c9edc" }}>
                        <h4 className="card-title">오늘 공부 시간</h4>
                        <h2 className="fs-1 fw-semibold">
                            {formatDuration(summary)}
                        </h2>
                    </div>
                </div>

                {/* 과목 리스트 */}
                <div>
                    {subjects.map(subject => (
                        <div
                            key={subject.subjectId}
                            onClick={() => navigate(`/timer/${subject.subjectId}`)}
                            className="d-flex justify-content-between align-items-center p-3 border-bottom"
                            style={{ cursor: "pointer", borderColor: "#eee" }}>
                            <span>{subject.subjectName}</span>
                            <span>
                                {formatDuration(getSubjectTime(subject.subjectId))}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimerHomePage;