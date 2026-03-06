// src/domain/timer/components/TimeControls.tsx

interface Props {
    running: boolean;
    elapsed: number;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
}

const TimerControls = ({running, elapsed, onStart, onPause, onResume, onStop}: Props) => {
    /**
     * 버튼 렌더링 기준
     *
     * 시작 : 타이머가 동작 중이 아닐 때 or 아직 시작되지 않았을 때
     * 일시정지 : 타이머가 동작 중일 때
     * 재개 : 타이머가 일시정지 상태지만 기록이 존재하는 경우
     * 종료 : 타이머 기록이 존재할 경우
     * */
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                marginTop: "10px"
            }}>

            {/* 시작 버튼 */}
            {!running && elapsed === 0 && (
                <button
                    onClick={onStart}
                    style={{
                        ...buttonStyle,
                        backgroundColor:"#5c9edc",
                        color:"#fff"
                    }}>
                    시작
                </button>
            )}

            {/* 일시정지 버튼 */}
            {running && (
                <button
                    onClick={onPause}
                    style={{
                        ...buttonStyle,
                        background: "#ffc107",
                        color: "#000"
                    }}>
                    일시정지
                </button>
            )}

            {/* 재개 버튼 */}
            {!running && elapsed > 0 && (
                <button
                    onClick={onResume}
                    style={{
                        ...buttonStyle,
                        backgroundColor:"#5c9edc",
                        color:"#fff"
                    }}>
                    재개
                </button>
            )}

            {/* 종료 버튼 */}
            {elapsed > 0 && (
                <button
                    onClick={onStop}
                    style={{
                        ...buttonStyle,
                        background: "#dc3545",
                        color: "white"
                    }}>
                    종료
                </button>
            )}
        </div>
    );
};

const buttonStyle: React.CSSProperties = {
    padding: "0.7rem 1.2rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#333",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
};

export default TimerControls;
