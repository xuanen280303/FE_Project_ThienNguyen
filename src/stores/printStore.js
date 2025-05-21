import logo from '@/assets/Img/logo.png';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { defineStore } from 'pinia';
import { useToast } from 'primevue';
import apiService from '../service/api.service';
import parseNum from '../utils/parseNum';
export const usePrintStore = defineStore('PrintStore', () => {
    const toast = useToast();

    // Khởi tạo PDF khổ A4
    const pageWidth = 210;
    const pageHeight = 297;
    // Thiết lập margin
    const margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };
    // Vùng in được
    const printWidth = pageWidth - margin.left - margin.right;

    const openPrintWindow = (pdfUrl) => {
        const options = `width=700,height=600,left=${(window.screen.width - 700) / 2},top=${(window.screen.height - 600) / 2}`;
        return window.open(pdfUrl, '_blank', options);
    };

    const getStatus = (status) => {
        switch (status) {
            case 'CXN':
                return 'Chờ xác nhận';
            case 'DTH':
                return 'Đang thực hiện';
            case 'DMT':
                return 'Đạt mục tiêu';
            case 'DKT':
                return 'Đã kết thúc';
            case 'TD':
                return 'Tạm dừng';
            default:
                return status;
        }
    };
    const addFontsToPDF = (doc) => {
        doc.addFont('/fonts/times-new-roman-normal.ttf', 'Times New Roman', 'normal');
        doc.addFont('/fonts/times-new-roman-bold.ttf', 'Times New Roman', 'bold');
        doc.addFont('/fonts/times-new-roman-italic.ttf', 'Times New Roman', 'italic');
        doc.addFont('/fonts/times-new-roman-bold-italic.ttf', 'Times New Roman', 'bolditalic');
        doc.setFont('Times New Roman');
    };

    const addHeaderToPDF = (doc, margin) => {
        const logoWidth = 70;
        const logoHeight = 15;

        // Thêm logo vào góc trái
        doc.addImage(logo, 'PNG', margin.left, margin.top, logoWidth, logoHeight);

        // Thêm tiêu đề vào góc phải
        doc.setFontSize(16);
        doc.setFont('Times New Roman', 'bold');
        doc.text('SAO KÊ DỰ ÁN', pageWidth - margin.right - 17, margin.top + 8, { align: 'right' });
        doc.setFontSize(9);
        doc.setFont('Times New Roman', 'bolditalic');
        doc.text('ACCOUNT STATEMENT', pageWidth - margin.right - 21, margin.top + 12, { align: 'right' });
    };

    const generatePDFImport = async (project) => {
        if (!project) {
            return;
        }
        try {
            if (!project) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không có dữ liệu để xuất', life: 3000 });
                return;
            }

            const res = await apiService.get(`donations?filter=project=${project._id},status=PAID&page=1&pageSize=9999999999`);
            const donation = res.data.items;
            if (donation.length === 0) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không có dữ liệu để xuất', life: 3000 });
                return;
            }

            const doc = new jsPDF('p', 'mm', 'a4');

            addFontsToPDF(doc);

            // Header
            addHeaderToPDF(doc, margin);

            // Reset font
            doc.setFontSize(13);
            doc.setFont('Times New Roman', 'bold');

            // Thông tin phiếu - cách logo 30mm
            const infoStartY = margin.top + 30;
            const lineHeight = 8; // Khoảng cách giữa các dòng
            doc.text(doc.splitTextToSize(`Dự án: ${project.name}`, printWidth), margin.left, infoStartY);

            doc.setFont('Times New Roman', 'normal');
            doc.text(doc.splitTextToSize(`Chiến dịch: ${project.campaign?.name}`, printWidth), margin.left, infoStartY + lineHeight);
            doc.text(doc.splitTextToSize(`Người/tổ chức kêu gọi: ${project.type == 'CN' ? project.user?.name : project.organization?.name}`, printWidth), margin.left, infoStartY + lineHeight * 2);
            doc.text(doc.splitTextToSize(`Ngày bắt đầu: ${format(project.startDate, 'dd/MM/yyyy')}`, printWidth / 2), margin.left, infoStartY + lineHeight * 3);
            doc.text(doc.splitTextToSize(`Ngày kết thúc: ${format(project.endDate, 'dd/MM/yyyy')}`, printWidth / 2), pageWidth - margin.right - printWidth / 2, infoStartY + lineHeight * 3);

            // Thông tin chuyển kho
            doc.text(doc.splitTextToSize(`Mục tiêu quyên góp: ${parseNum(project.goalAmount)} VNĐ`, printWidth), margin.left, infoStartY + lineHeight * 4);
            doc.text(doc.splitTextToSize(`Số tiền đã đạt được: ${parseNum(project.currentAmount)} VNĐ`, printWidth), margin.left, infoStartY + lineHeight * 5);
            doc.text(doc.splitTextToSize(`Trạng thái: ${getStatus(project.status)}`, printWidth), margin.left, infoStartY + lineHeight * 6);

            // Thêm event listener cho mỗi trang mới
            doc.setPage(1); // Đảm bảo bắt đầu từ trang 1
            const footerHeight = 20;
            const footerMargin = 10; // Khoảng cách giữa content và footer

            // Bảng sản phẩm
            const tableStartY = infoStartY + lineHeight * 7;
            doc.autoTable({
                startY: tableStartY,
                margin: {
                    left: margin.left,
                    right: margin.right,
                    bottom: margin.bottom + footerHeight + footerMargin
                },
                head: [['STT', 'Tên tài khoản NH', 'Số tài khoản NH', 'Mã ngân hàng', 'Số tiền', 'Nội dung chuyển khoản', 'Thời gian giao dịch']],

                body: donation.map((item, index) => [
                    index + 1,
                    item.counterAccountName || '--',
                    item.counterAccountNumber || '--',
                    item.counterAccountBankId || '--',
                    parseNum(item.amount) + ' VNĐ',
                    item.description || '--',
                    item.transactionDateTime || '--'
                ]),
                styles: {
                    font: 'Times New Roman',
                    fontSize: 10,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    lineColor: [0, 0, 0], // Màu đen cho đường kẻ
                    textColor: [0, 0, 0],
                    lineWidth: 0.1 // Độ dày đường kẻ
                },
                headStyles: {
                    fillColor: [255, 255, 255], // Nền trắng
                    textColor: [0, 0, 0], // Chữ đen hơn
                    fontStyle: 'bold',
                    fontSize: 10,
                    font: 'Times New Roman',
                    halign: 'center'
                },
                theme: 'grid', // Hiển thị đường kẻ lưới đầy đủ
                columnStyles: {
                    0: { cellWidth: 11 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 35 },
                    5: { cellWidth: 35 },
                    6: { cellWidth: 20 }
                }
            });

            const signatureY = doc.autoTable.previous.finalY + 10;
            // Kiểm tra không gian còn lại cho phần chữ ký và ngày tháng
            const remainingSpace = doc.internal.pageSize.height - signatureY;
            const signatureHeight = 65;

            let newSignatureY = signatureY;

            // Nếu không đủ chỗ, tạo trang mới
            if (remainingSpace < signatureHeight) {
                doc.addPage();
                newSignatureY = margin.top + 10;
            }
            doc.setFontSize(13); // Kích thước chữ
            const docDateObj = new Date();
            doc.setFont('Times New Roman', 'italic');
            doc.text(`Hà Nội, ngày ${docDateObj.getDate()} tháng ${docDateObj.getMonth() + 1} năm ${docDateObj.getFullYear()}`, pageWidth - margin.right - 20, newSignatureY, { align: 'right' });
            // Thông tin chuyển kho bên trái
            doc.setFont('Times New Roman', 'bold');
            doc.text(`Thiện Nguyện`, margin.left + 16, newSignatureY + 6);

            doc.setFont('Times New Roman', 'italic');
            doc.text(`(Ký, họ tên, đóng dấu)`, margin.left + 10, newSignatureY + 11);

            // Thông tin chuyển kho bên phải
            doc.setFont('Times New Roman', 'bold');
            doc.text(`Người tạo sao kê`, pageWidth - margin.right - 30, newSignatureY + 6, { align: 'right' });

            doc.setFont('Times New Roman', 'italic');
            doc.text(`(Ký, họ tên)`, pageWidth - margin.right - 36, newSignatureY + 11, { align: 'right' });

            // Tạo URL từ nội dung PDF
            openPrintWindow(doc.output('bloburl'));
        } catch (error) {
            console.error('Lỗi khi tạo PDF:', error);
        }
    };

    return { generatePDFImport };
});
