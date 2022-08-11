export const getUTCTime = (date) => {
    const year = new Date(date).getFullYear()
    const M = new Date(date).getMonth() + 1
    const month = M < 10 ? ('0' + M) : M
    const d = new Date(date).getDate()
    const day = d < 10 ? ('0' + d) : d
    const h = new Date(date).getHours()
    const hour = h < 10 ? ('0' + h) : h
    const m = new Date(date).getMinutes()
    const minute = m < 10 ? ('0' + m) : m
    const s = new Date(date).getSeconds()
    const seconds = s < 10 ? ('0' + s) : s
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
}