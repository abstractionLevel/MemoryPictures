export  const getUniqueDatesFromArray = (data) => {
    const uniqueDates = new Set();
    data.forEach(item => {
        uniqueDates.add(item.date);
    });
    return Array.from(uniqueDates); 
};
