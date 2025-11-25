export const calculateScore = (price, sqft, beds, baths) => {
    // Simple algorithm for demonstration
    // Higher score is better

    // 1. Price per sqft (Lower is better)
    const pricePerSqft = price / sqft;
    let priceScore = 0;
    if (pricePerSqft < 300) priceScore = 40;
    else if (pricePerSqft < 500) priceScore = 30;
    else if (pricePerSqft < 700) priceScore = 20;
    else priceScore = 10;

    // 2. Bedroom count (More is generally better for value, up to a point)
    let bedScore = Math.min(beds * 5, 20);

    // 3. Bathroom count
    let bathScore = Math.min(baths * 5, 20);

    // 4. Base score
    let baseScore = 20;

    const total = priceScore + bedScore + bathScore + baseScore;
    return Math.min(total, 100); // Cap at 100
};

export const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
};
