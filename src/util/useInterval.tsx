import {useEffect, useRef} from "react";

export type IntervalId = number | undefined

export function useInterval(callback: (intervalId: IntervalId) => void, delay: number): void {
    const savedCallback = useRef<(intervalId: IntervalId) => void>();
    const intervalId = useRef<IntervalId>()

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if(savedCallback.current) {
                savedCallback.current(intervalId.current);
            }
        }
        if (delay !== null) {
            // @ts-ignore
            intervalId.current = setInterval(tick, delay);
            return () => clearInterval(intervalId.current);
        }
    }, [delay]);
}