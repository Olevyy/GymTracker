

export const calculateOneRepMax = (weightStr: string, repsStr: string): string => {
    const weight = parseFloat(weightStr);
    const reps = parseInt(repsStr);

    if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
        return '-';
    }
    const oneRM = weight * (1 + reps / 30);
    return Math.round(oneRM).toString();
};