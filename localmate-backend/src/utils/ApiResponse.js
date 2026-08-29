class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static created(res, data, message = 'Created') {
    return res.status(201).json({ success: true, message, data });
  }

  static error(res, message = 'Error', statusCode = 400, errors = null) {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static paginate(res, data, total, page, limit, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  }

  static notFound(res, message = 'Not found') {
    return res.status(404).json({ success: false, message });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({ success: false, message });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({ success: false, message });
  }
}

module.exports = ApiResponse;
