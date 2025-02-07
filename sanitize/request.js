function checkInitiateRequestStatus(status) {
    return ["cancel", "interested"].includes(status)
}

function checkVerifyStatus(status) {
    return ["accepted", "rejected"].includes(status)
}

module.exports = {checkInitiateRequestStatus, checkVerifyStatus}