import { formatDuration, formatHHMM } from "../../../global/utils/timerUtil";

interface Record {
    timerId: number;
    subjectId: number;
    subjectName: string; // 🔥 필요
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
            <div className="card shadow-sm mb-4 text-center">
                <div className="card-body">
                    <h6 className="text-muted mb-1">오늘 총 공부 시간</h6>
                    <h3 className="text-primary fw-bold">
                        {formatDuration(summary)}
                    </h3>
                </div>
            </div>

            {/* 기록 목록 */}
            <div className="card shadow-sm">
                <div className="card-header fw-semibold">
                    오늘 공부 기록
                </div>

                <ul className="list-group list-group-flush">
                    {records.length === 0 ? (
                        <li className="list-group-item text-center text-muted">
                            오늘 기록이 없습니다.
                        </li>
                    ) : (
                        records.map((r) => (
                            <li
                                key={r.timerId}
                                className="list-group-item"
                            >
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="fw-semibold">
                                            {r.subjectName}
                                        </div>
                                        <div className="text-muted small">
                                            {formatHHMM(r.startTime)} ~ {formatHHMM(r.endTime)}
                                        </div>
                                    </div>

                                    <span className="badge bg-primary rounded-pill align-self-center">
                                        {formatDuration(r.duration)}
                                    </span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TimerRecordList;
