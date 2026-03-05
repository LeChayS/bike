function calculateTotal() {
    const ngayNhan = new Date(document.getElementById('NgayNhanXe').value);
    const ngayTra = new Date(document.getElementById('NgayTraXeDuKien').value);
    const giaThue = parseFloat(document.getElementById('GiaThueNgay').value) || 0;
    const tienCoc = parseFloat(document.getElementById('TienCoc').value) || 0; // Lấy giá trị user nhập
    const phuPhi = parseFloat(document.getElementById('PhuPhi').value) || 0;

    if (ngayNhan && ngayTra && ngayTra > ngayNhan) {
        const soNgay = Math.ceil((ngayTra - ngayNhan) / (1000 * 60 * 60 * 24));

        // Tính giá thuê đơn giản: giá thuê * số ngày
        const tienThue = giaThue * soNgay;

        const tongTien = tienThue + tienCoc + phuPhi; // Tính tổng với tiền cọc user nhập

        // Cập nhật hiển thị
        document.getElementById('soNgayThue').textContent = soNgay;
        document.getElementById('tienThue').textContent = tienThue.toLocaleString('vi-VN');
        document.getElementById('tienCoc').textContent = tienCoc.toLocaleString('vi-VN');
        document.getElementById('phuPhi').textContent = phuPhi.toLocaleString('vi-VN');
        document.getElementById('tongTien').textContent = tongTien.toLocaleString('vi-VN');
        document.getElementById('TongTienInput').value = tongTien;
        // KHÔNG tự động set tiền cọc nữa
    }
}

// Tính toán khi load trang
$(document).ready(function () {
    // Set tiền cọc = 0 khi load
    $('#TienCoc').val(0);

    // Tính toán
    calculateTotal();

    // Khi thay đổi tiền cọc hoặc phụ phí
    $('#TienCoc, #PhuPhi').on('input', function () {
        calculateTotal();
    });

    // Khi thay đổi ngày
    $('#NgayNhanXe, #NgayTraXeDuKien').on('change', function () {
        calculateTotal();
    });

    // Validate tiền cọc >= 0
    $('#TienCoc').on('blur', function () {
        var value = parseFloat($(this).val()) || 0;
        if (value < 0) {
            $(this).val(0);
            alert('Tiền cọc không được âm!');
        }
        calculateTotal();
    });
});