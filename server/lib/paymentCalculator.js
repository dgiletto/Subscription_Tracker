// Calculates the date of the next payment of a subscription dependent on billing period of subscription
export const calculateNextPayment = (nextPaymentDate, billingPeriod) => {
    const date = new Date(nextPaymentDate);
    switch (billingPeriod) {
        case 'Weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'Monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'Yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            // Default to monthly if billing period is not recognized
            date.setMonth(date.getMonth() + 1);
    }

    return date;
}