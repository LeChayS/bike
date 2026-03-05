let vehicleData = {};

// Load thông tin xe khi chọn
function updateVehicleInfo() {
    const maXe = document.getElementById('MaXe').value;
    const infoDiv = document.getElementById('vehicleInfo');

    if (!maXe) {
        infoDiv.innerHTML = 'Chọn xe để xem thông tin';
        document.getElementById('giaThueNgay').textContent = '0đ';
        calculateAmount();
        return;
    }

    // Call API để lấy thông tin xe
    fetch(`@Url.Action("GetXeInfo", "ChiTietHopDong")?maXe=${maXe}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                vehicleData = result.data;
                infoDiv.innerHTML = `
                            <strong>${result.data.tenXe}</strong><br>
                            Biển số: ${result.data.bienSoXe}<br>
                            Hãng: ${result.data.hangXe} ${result.data.dongXe}<br>
                            Giá: ${result.data.giaThue.toLocaleString('vi-VN')}đ/ngày
                        `;
                document.getElementById('giaThueNgay').textContent = result.data.giaThue.toLocaleString('vi-VN') + 'đ';
                calculateAmount();
            } else {
                infoDiv.innerHTML = 'Không thể tải thông tin xe';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            infoDiv.innerHTML = 'Lỗi khi tải thông tin xe';
        });
}

// Tính toán số tiền
function calculateAmount() {
    const ngayNhan = document.getElementById('NgayNhanXe').value;
    const ngayTra = document.getElementById('NgayTraXeDuKien').value;

    if (ngayNhan && ngayTra && vehicleData.giaThue) {
        const startDate = new Date(ngayNhan);
        const endDate = new Date(ngayTra);
        const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (dayDiff > 0) {
            const tongTien = dayDiff * vehicleData.giaThue;

            document.getElementById('soNgayThue').textContent = dayDiff + ' ngày';
            document.getElementById('thanhTien').textContent = tongTien.toLocaleString('vi-VN') + 'đ';
        } else {
            document.getElementById('soNgayThue').textContent = '0 ngày';
            document.getElementById('thanhTien').textContent = '0đ';
        }
    } else {
        document.getElementById('soNgayThue').textContent = '0 ngày';
        document.getElementById('thanhTien').textContent = '0đ';
    }
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
});