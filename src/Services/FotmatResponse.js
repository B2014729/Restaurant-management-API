const FormatResponseJson = (statuscode, message, data) => {
    return {
        statusCode: statuscode,
        message: message,
        data: data
    };
}

export default FormatResponseJson;