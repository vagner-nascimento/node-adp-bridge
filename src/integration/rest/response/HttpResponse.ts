
import httpStatus from "http-status"

export function isRequestFailed(status: number): boolean {
    return status < httpStatus.OK || status >= httpStatus.MULTIPLE_CHOICES
}
