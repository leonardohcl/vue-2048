
export function getPageSize() {
    return {
        top: 0,
        left: 0,
        viewHeight: Math.min(
            document.body.clientHeight,
            document.documentElement.clientHeight
        ),
        viewWidth: Math.min(
            document.body.clientWidth,
            document.documentElement.clientWidth
        ),
        height: Math.max(
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        ),
        width: Math.max(
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.body.clientWidth,
            document.documentElement.clientWidth
        ),
    }
}