export const ExceptionCodes: { [key: string]: number } = {
    // 100 -> permissions
    PERMISSION_ERROR: 100,
    MISSING_BOT_PERMS: 101,
    MISSING_MEMBER_PERMS: 102,
    FAILED_CUSTOM_FILTERS: 103,
    // 200 -> command arguments
    ARGS_ERROR: 200,
    INSUFFICIENT_ARGS: 201,
    INVALID_ARGS: 202,
    // ??? -> misc.
    NOT_FOUND: 404,
    UNKNOWN_ERROR: 999,
};
