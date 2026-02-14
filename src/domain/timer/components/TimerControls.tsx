interface Props {
    running: boolean;
    elapsed: number;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
}

const TimerControls = ({
                           running,
                           elapsed,
                           onStart,
                           onPause,
                           onResume,
                           onStop,
                       }: Props) => {
    if (!running && elapsed === 0) {
        return <button onClick={onStart}>시작</button>;
    }

    if (running) {
        return (
            <>
                <button onClick={onPause}>일시정지</button>
                <button onClick={onStop}>종료</button>
            </>
        );
    }

    return (
        <>
            <button onClick={onResume}>재개</button>
            <button onClick={onStop}>종료</button>
        </>
    );
};

export default TimerControls;
