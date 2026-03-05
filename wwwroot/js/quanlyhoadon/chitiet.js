// Function toggle dropdown
function togglePrintDropdown(event) {
    event.preventDefault();
    event.stopPropagation();

    var dropdownMenu = document.getElementById('printDropdownMenu');
    if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
        dropdownMenu.style.display = 'block';
    } else {
        dropdownMenu.style.display = 'none';
    }
}

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', function (event) {
    var dropdown = document.querySelector('.dropdown');
    var dropdownMenu = document.getElementById('printDropdownMenu');

    if (!dropdown.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

// Function in trang hiện tại
function printCurrentPage(event) {
    event.preventDefault();
    event.stopPropagation();

    // Đóng dropdown trước khi in
    document.getElementById('printDropdownMenu').style.display = 'none';
    window.print();
}

// Function in hóa đơn đơn giản
function printInvoiceOnly(event) {
    event.preventDefault();
    event.stopPropagation();

    // Đóng dropdown trước khi in
    document.getElementById('printDropdownMenu').style.display = 'none';

    // Tạo một cửa sổ mới với nội dung hóa đơn đơn giản
    var printWindow = window.open('', '_blank', 'width=800,height=600');
    var invoiceContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Hóa đơn HD${@Model.MaHoaDon.ToString("D6")}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .invoice-header { text-align: center; margin-bottom: 30px; }
                        .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                        .invoice-info { margin-bottom: 20px; }
                        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                        .total-amount { font-size: 20px; font-weight: bold; text-align: center; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; font-size: 12px; }
                        @@media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <div class="invoice-title">HÓA ĐƠN THANH TOÁN</div>
                        <div>HD${@Model.MaHoaDon.ToString("D6")}</div>
                        <div>Ngày: ${new Date().toLocaleDateString('vi-VN')}</div>
                    </div>
                    
                    <div class="invoice-info">
                        <div class="info-row">
                            <span><strong>Khách hàng:</strong></span>
                            <span>${'@Model.HopDong?.HoTenKhach'}</span>
                        </div>
                        <div class="info-row">
                            <span><strong>Số điện thoại:</strong></span>
                            <span>${'@Model.HopDong?.SoDienThoai'}</span>
                        </div>
                        <div class="info-row">
                            <span><strong>Hợp đồng:</strong></span>
                            <span>HD${'@Model.MaHopDong.ToString("D6")'}</span>
                        </div>
                    </div>
                    
                    <div class="total-amount">
                        TỔNG TIỀN: ${'@Model.SoTien.ToString("N0")'}đ
                    </div>
                    
                    <div class="footer">
                        <p>CÔNG TY CHO THUÊ XE MÁY SÀI GÒN</p>
                        <p>95/38 Nguyễn Văn Trỗi, Phường 12, Quận Phú Nhuận, TP.HCM</p>
                        <p>Điện thoại: 0908.630.065</p>
                    </div>
                </body>
                </html>
            `;

    printWindow.document.write(invoiceContent);
    printWindow.document.close();

    // Tự động in sau khi load xong
    printWindow.onload = function () {
        printWindow.print();
    };
}