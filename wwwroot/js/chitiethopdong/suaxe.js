const originalAmount = @Model.ThanhTien;

// Tính toán số tiền mới
function calculateAmount() {
    const ngayNhan = document.getElementById('NgayNhanXe').value;
    const ngayTra = document.getElementById('NgayTraXeDuKien').value;
    const giaThue = parseFloat(document.getElementById('GiaThueNgay').value) || 0;

    if (ngayNhan && ngayTra && giaThue > 0) {
        const startDate = new Date(ngayNhan);
        const endDate = new Date(ngayTra);
        const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (dayDiff > 0) {
            const tongTienMoi = dayDiff * giaThue;
            const chenhLech = tongTienMoi - originalAmount;

            document.getElementById('soNgayThueMoi').textContent = dayDiff + ' ngày';
            document.getElementById('giaThueNgayMoi').textContent = giaThue.toLocaleString('vi-VN') + 'đ';
            document.getElementById('thanhTienMoi').textContent = tongTienMoi.toLocaleString('vi-VN') + 'đ';

            const chenhLechElement = document.getElementById('chenhLech');
            if (chenhLech > 0) {
                chenhLechElement.textContent = '+' + chenhLech.toLocaleString('vi-VN') + 'đ';
                chenhLechElement.className = 'text-success';
            } else if (chenhLech < 0) {
                chenhLechElement.textContent = chenhLech.toLocaleString('vi-VN') + 'đ';
                chenhLechElement.className = 'text-danger';
            } else {
                chenhLechElement.textContent = '0đ';
                chenhLechElement.className = 'text-info';
            }
        } else {
            resetCalculation();
        }
    } else {
        resetCalculation();
    }
}

function resetCalculation() {
    document.getElementById('soNgayThueMoi').textContent = '0 ngày';
    document.getElementById('giaThueNgayMoi').textContent = '0đ';
    document.getElementById('thanhTienMoi').textContent = '0đ';
    document.getElementById('chenhLech').textContent = '0đ';
    document.getElementById('chenhLech').className = 'text-info';
}

// Set validation cho ngày
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('NgayNhanXe').min = today;

    document.getElementById('NgayNhanXe').addEventListener('change', function () {
        const ngayNhanXe = new Date(this.value);
        ngayNhanXe.setDate(ngayNhanXe.getDate() + 1);
        document.getElementById('NgayTraXeDuKien').min = ngayNhanXe.toISOString().split('T')[0];
    });

    // Trigger calculation ban đầu
    calculateAmount();
});