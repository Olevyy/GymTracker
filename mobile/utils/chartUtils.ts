// Sampling data to remove least important points for better readabilitty
export function sampleChartData<T>(data: T[], maxPoints: number = 9): T[] {
    if (!data || data.length === 0) return [];
    if (data.length <= maxPoints) return data;

    const sampled: T[] = [];
    const step = (data.length - 1) / (maxPoints - 1);
    
    const addedIndices = new Set<number>();

    for (let i = 0; i < maxPoints; i++) {
        const index = i === maxPoints - 1 ? data.length - 1 : Math.round(i * step);
        
        if (!addedIndices.has(index)) {
            sampled.push(data[index]);
            addedIndices.add(index);
        }
    }

    return sampled;
}