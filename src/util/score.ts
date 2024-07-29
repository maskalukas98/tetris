export const calculateIntervalDelay = (score: number) => {
    if (score < 10) {
        return 350;
    } else if (score < 25) {
        return 250;
    } else if (score < 50) {
        return 150;
    } else {
        return 100;
    }
};