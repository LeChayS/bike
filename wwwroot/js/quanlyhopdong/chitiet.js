// Print formatting
window.addEventListener('beforeprint', function () {
    document.body.style.padding = '0';
    document.querySelector('.container-fluid').style.maxWidth = '100%';
});

window.addEventListener('afterprint', function () {
    document.body.style.padding = '';
    document.querySelector('.container-fluid').style.maxWidth = '';
});

// Function xóa xe khỏi hợp đồng
function confirmDeleteVehicle(maChiTiet, tenXe) {
    if (confirm(`Bạn có chắc muốn xóa xe "${tenXe}" khỏi hợp đồng?\n\nLưu ý: Thao tác này không thể hoàn tác!`)) {
        const form = document.getElementById('deleteVehicleForm');
        form.action = '@Url.Action("XoaXe", "ChiTietHopDong")';
        form.querySelector('input[name="id"]').value = maChiTiet;
        form.submit();
    }
}
// Thêm function tạo hóa đơn nhanh
function taoHoaDonNhanh(maHopDong) {
    console.log('Tao hoa don nhanh:', maHopDong);

    // Reset form
    $('#ghiChuHoaDonNhanh').val('');

    // Hiển thị modal
    var myModal = new bootstrap.Modal(document.getElementById('taoHoaDonNhanhModal'));
    myModal.show();
}
function xacNhanTaoHoaDonNhanh() {
    var maHopDong = @Model.MaHopDong;
    var ghiChu = $('#ghiChuHoaDonNhanh').val();

    // Hiển thị loading
    var btn = $('.modal-footer .btn-success');
    var originalText = btn.html();
    btn.html('<span class="spinner-border spinner-border-sm"></span> Đang tạo...').prop('disabled', true);
    $.ajax({
        url: '@Url.Action("TaoHoaDon", "QuanLyHoaDon")',
        type: 'POST',
        data: {
            maHopDong: maHopDong,
            ghiChu: ghiChu,
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        success: function (response) {
            if (response.success) {
                // Hiển thị thông báo thành công
                if (typeof toastr !== 'undefined') {
                    toastr.success(response.message);
                } else {
                    alert(response.message);
                }
                // Reload trang để hiển thị thông tin hóa đơn
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                if (typeof toastr !== 'undefined') {
                    toastr.error(response.message);
                } else {
                    alert('Lỗi: ' + response.message);
                }
                btn.html(originalText).prop('disabled', false);
            }
        },
        error: function (xhr, status, error) {
            var errorMsg = 'Có lỗi xảy ra: ' + error;
            if (typeof toastr !== 'undefined') {
                toastr.error(errorMsg);
            } else {
                alert(errorMsg);
            }
            btn.html(originalText).prop('disabled', false);
        },
        complete: function () {
            bootstrap.Modal.getInstance(document.getElementById('taoHoaDonNhanhModal')).hide();
        }
    });
}

// Function để load tổng tiền khách đã trả
function loadTongTienKhachDaTra() {
    const maHopDong = @Model.MaHopDong;

    $.ajax({
        url: '@Url.Action("GetTongTienKhachDaTra", "QuanLyThietHai")',
        type: 'GET',
        data: { maHopDong: maHopDong },
        success: function (response) {
            if (response.success) {
                const data = response.data;
                const tienThueXe = data.TienThueXe;
                const phiDenBuDaTra = data.TongPhiDenBuDaTra;
                const tongTienKhachDaTra = data.TongTienKhachDaTra;

                // Hiển thị thông tin
                $('#tienThueXeDisplay').text(tienThueXe.toLocaleString('vi-VN') + 'đ');
                $('#phiDenBuDisplay').text(phiDenBuDaTra.toLocaleString('vi-VN') + 'đ');
                $('#tongTienKhachDaTraDisplay').text(tongTienKhachDaTra.toLocaleString('vi-VN') + 'đ');

                // Hiển thị section nếu có phí đền bù
                if (phiDenBuDaTra > 0) {
                    $('#tongTienKhachDaTraSection').show();
                }
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading payment info:', error);
        }
    });
}

// Function xem giấy tờ
function previewDocument(imageSrc, title) {
    // Cập nhật modal title
    document.getElementById('documentModalTitle').textContent = title;

    // Cập nhật image src
    document.getElementById('documentModalImage').src = imageSrc;

    // Cập nhật download link
    document.getElementById('documentModalDownload').href = imageSrc;

    // Hiển thị modal
    var modal = new bootstrap.Modal(document.getElementById('documentPreviewModal'));
    modal.show();
}

// Load thông tin khi trang load
$(document).ready(function () {
    loadTongTienKhachDaTra();

    // Debug: Check image loading
    $('.document-image').each(function () {
        var img = $(this);
        var src = img.attr('src');
        console.log('Checking image:', src);

        img.on('error', function () {
            console.error('Failed to load image:', src);
        });

        img.on('load', function () {
            console.log('Successfully loaded image:', src);
        });
    });
});