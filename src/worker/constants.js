const jobType = Object.freeze({
    BLACKHOLE_WITHDRAW: "BLACKHOLE_WITHDRAW",
});

const status = Object.freeze({
    QUEUED: 'QUEUED',
    ACCEPTED: 'ACCEPTED',
    SENT: 'SENT',
    RESUBMITTED: 'RESUBMITTED',
    CONFIRMED: 'CONFIRMED',
    FAILED: 'FAILED',
});

module.exports = {
    jobType,
    status,
};
