export default function parseNum(num) {
    if (!num) return '0';
    return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
