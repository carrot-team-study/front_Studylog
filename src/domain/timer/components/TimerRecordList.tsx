// src/domain/timer/components/TimerRecordList.tsx

import {formatDuration, formatHHMM} from "../../../global/utils/timerUtil";

interface Record {
    timerId: number;
    subjectId: number;
    subjectName: string;
    duration: number;
    startTime: string;
    endTime: string;
}

interface Props {
    records: Record[];
    summary: number;
}

const TimerRecordList = ({ records, summary }: Props) => {
    return (
        <div className="container mt-4">
            {/* 총 공부 시간 */}
            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body text-center py-4">
                    <h6 className="text-secondary mb-2 fw-normal">오늘 총 공부 시간</h6>
                    <h4 className="display-7 fw-bold text-break mb-0">
                        {formatDuration(summary)}
                    </h4>
                </div>
            </div>

            {/* 기록 목록 */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h6 className="mb-0 fw-bold">상세 학습 기록</h6>
                </div>

                {records.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                        <i className="bi bi-info-circle d-block mb-2 fs-4"></i>
                        오늘 기록이 없습니다
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0 text-center">
                            <thead className="table-light">
                            <tr>
                                <th className="fw-semibold text-secondary py-3" style={{ width: "25%" }}>과목</th>
                                <th className="fw-semibold text-secondary py-3" style={{ width: "50%" }}>학습 시간대</th>
                                <th className="fw-semibold text-secondary py-3" style={{ width: "25%" }}>소요 시간</th>
                            </tr>
                            </thead>
                            <tbody>
                            {records.map((r) => (
                                <tr key={r.timerId}>
                                    <td className="small">
                                        {r.subjectName}
                                    </td>
                                    <td className="text-muted small">
                                        {formatHHMM(r.startTime)} ~ {formatHHMM(r.endTime)}
                                    </td>
                                    <td>
                                        <span className="badge fw-medium px-3 py-2 rounded-pill"
                                              style={{backgroundColor:"#5c9edc"}}>
                                            {formatDuration(r.duration)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimerRecordList;