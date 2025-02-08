const parseDate = (dateString) => {
    // Kiểm tra nếu đã là đối tượng Date
    if (dateString instanceof Date) {
        return dateString.toISOString();
    }

    // Kiểm tra nếu là chuỗi ISO
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(dateString)) {
        return new Date(dateString).toISOString();
    }

    // Kiểm tra định dạng dd/MM/yyyy
    const ddMMyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (ddMMyyyyRegex.test(dateString)) {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`).toISOString();
    }

    // Kiểm tra định dạng yyyy-MM-dd
    const yyyyMMddRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (yyyyMMddRegex.test(dateString)) {
        return new Date(dateString).toISOString();
    }

    // Nếu không khớp định dạng nào, trả về null hoặc ngày hiện tại
    return new Date().toISOString();
};

export default parseDate;
