// Dữ liệu xe để tính toán
const vehicleData = [
    @if (hasChiTiet && Model.ChiTietHopDong.Any()) {
    @foreach(var chiTiet in Model.ChiTietHopDong.Select((ct, index) => new { ct, index }))
    {
        @: {
            @: giaTriXe: @(chiTiet.ct.Xe?.GiaTriXe ?? 0),
            @: giaThueNgay: @chiTiet.ct.GiaThueNgay
            @:
        } @(chiTiet.index < Model.ChiTietHopDong.Count - 1 ? "," : "")
    }
}
        ];

// Format hiển thị phụ phí
function formatOtherFeeDisplay() {
    const otherFeeInput = document.getElementById('otherFeeInput');
    if (!otherFeeInput) return;

    let otherFeePreview = otherFeeInput.parentNode.querySelector('.cost-preview');
    if (!otherFeePreview) {
        otherFeePreview = document.createElement('small');
        otherFeePreview.className = 'form-text cost-preview';
        otherFeeInput.parentNode.appendChild(otherFeePreview);
    }

    const value = parseInt(otherFeeInput.value) || 0;
    if (value > 0) {
        otherFeePreview.innerHTML = '<i class="bi bi-eye"></i> Hiển thị: ' + value.toLocaleString('vi-VN') + 'đ';
    } else {
        otherFeePreview.innerHTML = '';
    }
}

function calculateFinal() {
    try {
        const ngayNhan = new Date('@Model.NgayNhanXe.ToString("yyyy-MM-dd")');
        const ngayTraInput = document.querySelector('input[name="ngayTraThucTe"]').value;
        const ngayTra = new Date(ngayTraInput);
        const giaThue = @(hasChiTiet && Model.ChiTietHopDong.Any() ? Model.ChiTietHopDong.First().GiaThueNgay : 0);
        const phuPhi = parseFloat(document.querySelector('input[name="phuPhi"]').value) || 0;

        if (ngayTra) {
            // Kiểm tra ngày trả xe thực tế có hợp lệ không
            if (ngayTra < ngayNhan) {
                document.getElementById('soNgayThue').innerHTML = '0 ngày';
                document.getElementById('tienThueXe').innerHTML = '0đ';
                document.getElementById('tongTienFinal').innerHTML = '0đ';
                return;
            }
            // Tính số ngày thuê
            let soNgay = Math.ceil((ngayTra - ngayNhan) / (1000 * 60 * 60 * 24));

            // Nếu số ngày <= 0 (cùng ngày hoặc trả sớm hơn) thì tính 1 ngày
            if (soNgay <= 0) {
                soNgay = 1;
            }

            const tienThue = soNgay * giaThue;
            const tongTien = tienThue + phuPhi;

            document.getElementById('soNgayThue').innerHTML = soNgay + ' ngày';
            document.getElementById('tienThueXe').innerHTML = tienThue.toLocaleString('vi-VN') + 'đ';

            document.getElementById('tongTienFinal').innerHTML = tongTien.toLocaleString('vi-VN') + 'đ';
        }
    } catch (error) {
        console.error('Error in calculateFinal:', error);
    }
}

// Xử lý thay đổi tình trạng xe
function handleTinhTrangXeChange() {
    const tinhTrangXe = document.getElementById('tinhTrangXeSelect').value;
    const thietHaiForm = document.getElementById('thietHaiForm');

    if (tinhTrangXe === 'Có sự cố') {
        thietHaiForm.style.display = 'block';
        // Đặt required cho các trường thiệt hại
        document.getElementById('loaiThietHaiSelect').required = true;
        document.getElementById('ngayXayRaThietHai').required = true;
        document.getElementById('moTaThietHaiText').required = true;
    } else {
        thietHaiForm.style.display = 'none';
        // Bỏ required cho các trường thiệt hại
        document.getElementById('loaiThietHaiSelect').required = false;
        document.getElementById('ngayXayRaThietHai').required = false;
        document.getElementById('moTaThietHaiText').required = false;
    }
}

// Khởi tạo khi load trang
$(document).ready(function () {
    // Khởi tạo format display cho phụ phí
    formatOtherFeeDisplay();

    calculateFinal();

    // Thêm event listener cho input ngày trả xe thực tế để tính toán real-time
    $('input[name="ngayTraThucTe"]').on('change input', function () {
        calculateFinal();
    });

    // Validate form trước khi submit
    $('form').on('submit', function (e) {

        // Kiểm tra có dữ liệu xe không
        if (!@hasChiTiet.ToString().ToLower()) {
            e.preventDefault();
            alert('Không thể trả xe vì hợp đồng thiếu thông tin xe!');
            return false;
        }

        // Kiểm tra ngày trả xe thực tế
        const ngayTraThucTe = document.querySelector('input[name="ngayTraThucTe"]').value;
        const ngayNhanXe = '@Model.NgayNhanXe.ToString("yyyy-MM-dd")';

        if (ngayTraThucTe < ngayNhanXe) {
            e.preventDefault();
            alert('Ngày trả xe thực tế không thể nhỏ hơn ngày nhận xe!');
            return false;
        }

        // Kiểm tra tình trạng xe
        const tinhTrangXe = document.getElementById('tinhTrangXeSelect').value;
        if (!tinhTrangXe) {
            e.preventDefault();
            alert('Vui lòng chọn tình trạng xe!');
            return false;
        }

        // Kiểm tra thông tin thiệt hại nếu có sự cố
        if (tinhTrangXe === 'Có sự cố') {
            const loaiThietHai = document.getElementById('loaiThietHaiSelect').value;
            const moTaThietHai = document.getElementById('moTaThietHaiText').value;

            if (!loaiThietHai || !moTaThietHai.trim()) {
                e.preventDefault();
                alert('Vui lòng điền đầy đủ thông tin thiệt hại!');
                return false;
            }
        }

        const confirmed = confirm('Xác nhận hoàn tất trả xe?');
        if (confirmed) {
            // Hiển thị loading state
            const submitBtn = $(this).find('button[type="submit"]');
            const originalText = submitBtn.html();
            submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý...');

            // Nếu có lỗi, sẽ restore button trong 10 giây
            setTimeout(function () {
                submitBtn.prop('disabled', false).html(originalText);
            }, 10000);
        }
        return confirmed;
    });
});