// Biến để kiểm tra xem đã xác nhận chưa
var isConfirmed = false;
var currentForm = null;

document.addEventListener('DOMContentLoaded', function () {
    // Tìm form
    const form = document.getElementById('datChoForm');
    const confirmModal = document.getElementById('confirmBookingModal');
    const confirmBtn = document.getElementById('confirmBookingBtn');



    if (form) {
        // Xử lý sự kiện submit form
        form.addEventListener('submit', function (e) {
            // Nếu chưa xác nhận, ngăn submit và hiển thị modal
            if (!isConfirmed) {
                e.preventDefault();

                // Kiểm tra validation trước khi hiển thị modal
                let isValid = true;

                // Kiểm tra các trường bắt buộc
                const requiredFields = form.querySelectorAll('input[required], select[required]');

                requiredFields.forEach(function (field) {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });

                // Nếu form hợp lệ, hiển thị modal xác nhận
                if (isValid) {
                    currentForm = this;
                    try {
                        const modal = new bootstrap.Modal(confirmModal);
                        modal.show();
                    } catch (error) {
                        // Fallback: sử dụng confirm dialog
                        if (confirm('Bạn có chắc chắn muốn đặt giữ chỗ cho xe này không?')) {
                            isConfirmed = true;
                            this.submit();
                        }
                    }
                } else {
                    // Scroll đến trường đầu tiên có lỗi
                    const firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
        });
    }

    // Thêm event listener cho nút submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            if (!isConfirmed) {
                e.preventDefault();
                e.stopPropagation();

                // Hiển thị modal trực tiếp
                if (confirmModal) {
                    try {
                        const modal = new bootstrap.Modal(confirmModal);
                        modal.show();
                        currentForm = form;
                    } catch (error) {
                        // Fallback: sử dụng confirm dialog
                        if (confirm('Bạn có chắc chắn muốn đặt giữ chỗ cho xe này không?')) {
                            isConfirmed = true;
                            form.submit();
                        }
                    }
                } else {
                    // Fallback: sử dụng confirm dialog
                    if (confirm('Bạn có chắc chắn muốn đặt giữ chỗ cho xe này không?')) {
                        isConfirmed = true;
                        form.submit();
                    }
                }
            }
        });
    }

    // Xử lý khi click nút xác nhận trong modal
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            if (currentForm) {
                // Đánh dấu đã xác nhận
                isConfirmed = true;

                // Đóng modal
                const modal = bootstrap.Modal.getInstance(confirmModal);
                if (modal) {
                    modal.hide();
                }

                // Submit form sau một chút delay
                setTimeout(function () {
                    currentForm.submit();
                }, 300);
            }
        });
    }

    // Reset trạng thái khi đóng modal
    if (confirmModal) {
        confirmModal.addEventListener('hidden.bs.modal', function () {
            if (!isConfirmed) {
                currentForm = null;
            }
        });
    }
});
// Lấy giá thuê từ Model
var giaThue = @Html.Raw(Model.GiaThue)

// Tính toán từ số ngày thuê được nhập
function calculateFromDays() {
    const soNgayInput = document.getElementById('soNgayThueInput');
    const ngayNhanInput = document.getElementById('NgayNhanXe');
    const ngayTraInput = document.getElementById('NgayTraXe');

    let soNgay = parseInt(soNgayInput.value) || 2;

    // Giới hạn từ 1-30 ngày
    if (soNgay < 1) soNgay = 1;
    if (soNgay > 30) soNgay = 30;
    soNgayInput.value = soNgay;

    // Tính toán ngày trả dựa trên ngày nhận và số ngày thuê
    const ngayNhan = new Date(ngayNhanInput.value);
    if (ngayNhan) {
        const ngayTra = new Date(ngayNhan);
        ngayTra.setDate(ngayNhan.getDate() + soNgay);

        // Cập nhật ngày trả
        ngayTraInput.value = ngayTra.toISOString().split('T')[0];

        // Tính toán lại giá
        calculatePrice();
    }
}
// Hàm set số ngày thuê từ các nút preset
function setRentalDays(days) {
    const soNgayInput = document.getElementById('soNgayThueInput');
    soNgayInput.value = days;

    // Highlight button được chọn
    const buttons = document.querySelectorAll('.rental-period-input .btn-outline-primary');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Tìm button tương ứng và highlight
    const activeButton = [...buttons].find(btn => btn.textContent.includes(days.toString()));
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Tự động tính toán
    calculateFromDays();
}

// Tính toán giá và số ngày
function calculatePrice() {
    const ngayNhan = new Date(document.getElementById('NgayNhanXe').value);
    const ngayTra = new Date(document.getElementById('NgayTraXe').value);

    if (ngayNhan && ngayTra && ngayTra >= ngayNhan) {
        const soNgay = Math.ceil((ngayTra - ngayNhan) / (1000 * 60 * 60 * 24));
        const tongTien = soNgay * giaThue;

        document.getElementById('soNgayThue').textContent = soNgay + ' ngày';
        document.getElementById('tongTien').textContent = tongTien.toLocaleString('vi-VN') + 'đ';

        // Cập nhật input số ngày thuê để đồng bộ
        document.getElementById('soNgayThueInput').value = soNgay;

        // Highlight button preset tương ứng
        updatePresetButtons(soNgay);
    }
}

// Cập nhật trạng thái của các nút preset
function updatePresetButtons(currentDays) {
    const buttons = document.querySelectorAll('.rental-period-input .btn-outline-primary');
    buttons.forEach(btn => {
        btn.classList.remove('active');

        // Kiểm tra nếu button này tương ứng với số ngày hiện tại
        if ((currentDays === 1 && btn.textContent.includes('1 ngày')) ||
            (currentDays === 3 && btn.textContent.includes('3 ngày')) ||
            (currentDays === 7 && btn.textContent.includes('1 tuần')) ||
            (currentDays === 14 && btn.textContent.includes('2 tuần'))) {
            btn.classList.add('active');
        }
    });
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', function () {
    // Set giá trị mặc định cho các input date
    const today = new Date();
    const ngayNhanInput = document.getElementById('NgayNhanXe');
    const ngayTraInput = document.getElementById('NgayTraXe');

    if (!ngayNhanInput.value) {
        ngayNhanInput.value = today.toISOString().split('T')[0];
    }

    if (!ngayTraInput.value) {
        const ngayTra = new Date(today);
        ngayTra.setDate(today.getDate() + 1);
        ngayTraInput.value = ngayTra.toISOString().split('T')[0];
    }

    // Tính toán ban đầu
    calculatePrice();
});

// Real-time validation
$(document).ready(function () {
    // Validate họ tên
    $('#HoTen').on('blur', function () {
        const hoTen = $(this).val();
        const $input = $(this);
        const $error = $input.siblings('.text-danger');

        if (hoTen.length < 3) {
            $input.removeClass('is-valid').addClass('is-invalid');
            if ($error.length === 0) {
                $input.after('<span class="text-danger">Họ tên phải có ít nhất 3 ký tự</span>');
            } else {
                $error.text('Họ tên phải có ít nhất 3 ký tự');
            }
        } else {
            $input.removeClass('is-invalid').addClass('is-valid');
            $error.text('');
        }
    });

    // Validate số điện thoại real-time
    $('#SoDienThoai').on('input', function () {
        const sdt = $(this).val();
        const $input = $(this);
        let $error = $input.siblings('.text-danger');

        // Regex cho số điện thoại Việt Nam
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

        if (sdt.length > 0) {
            if (!phoneRegex.test(sdt)) {
                $input.removeClass('is-valid').addClass('is-invalid');
                if ($error.length === 0) {
                    $input.after('<span class="text-danger">Số điện thoại không hợp lệ (VD: 0901234567)</span>');
                } else {
                    $error.text('Số điện thoại không hợp lệ (VD: 0901234567)');
                }
            } else {
                $input.removeClass('is-invalid').addClass('is-valid');
                $error.text('');
            }
        }
    });

    // Validate email real-time với debounce
    let emailTimeout;
    $('#Email').on('input', function () {
        clearTimeout(emailTimeout);
        const email = $(this).val();
        const $input = $(this);
        let $error = $input.siblings('.text-danger');

        if (email.length > 0) {
            emailTimeout = setTimeout(function () {
                // Validate email format
                const emailRegex = /^[^\s@@]+@@[^\s@@]+\.[^\s@@]+$/;

                if (!emailRegex.test(email)) {
                    $input.removeClass('is-valid').addClass('is-invalid');
                    if ($error.length === 0) {
                        $input.after('<span class="text-danger">Email không đúng định dạng</span>');
                    } else {
                        $error.text('Email không đúng định dạng');
                    }
                } else {
                    $input.removeClass('is-invalid').addClass('is-valid');
                    $error.text('');
                }
            }, 500); // Debounce 500ms
        }
    });

    // Validate ngày nhận xe
    $('#NgayNhanXe').on('change', function () {
        const ngayNhan = new Date($(this).val());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const $input = $(this);
        let $error = $input.siblings('.text-danger');

        if (ngayNhan < today) {
            $input.removeClass('is-valid').addClass('is-invalid');
            if ($error.length === 0) {
                $input.after('<span class="text-danger">Ngày nhận xe phải từ hôm nay trở đi</span>');
            } else {
                $error.text('Ngày nhận xe phải từ hôm nay trở đi');
            }
        } else {
            $input.removeClass('is-invalid').addClass('is-valid');
            $error.text('');

            // Validate lại ngày trả nếu có
            validateNgayTra();

            // Cập nhật ngày trả dựa trên số ngày thuê hiện tại
            const soNgayThue = parseInt($('#soNgayThueInput').val()) || 2;
            const ngayTra = new Date(ngayNhan);
            ngayTra.setDate(ngayNhan.getDate() + soNgayThue);
            $('#NgayTraXe').val(ngayTra.toISOString().split('T')[0]);
        }

        calculatePrice();
    });

    // Validate ngày trả xe
    $('#NgayTraXe').on('change', function () {
        validateNgayTra();
        calculatePrice();
    });

    function validateNgayTra() {
        const ngayNhan = new Date($('#NgayNhanXe').val());
        const ngayTra = new Date($('#NgayTraXe').val());
        const $input = $('#NgayTraXe');
        let $error = $input.siblings('.text-danger');

        if (ngayTra <= ngayNhan) {
            $input.removeClass('is-valid').addClass('is-invalid');
            if ($error.length === 0) {
                $input.after('<span class="text-danger">Ngày trả xe phải sau ngày nhận xe</span>');
            } else {
                $error.text('Ngày trả xe phải sau ngày nhận xe');
            }
        } else {
            $input.removeClass('is-invalid').addClass('is-valid');
            $error.text('');
        }
    }
    // Validate số ngày thuê
    $('#soNgayThueInput').on('input', function () {
        const $input = $(this);
        let value = parseInt($input.val());

        // Xử lý giá trị không hợp lệ
        if (isNaN(value) || value < 1) {
            value = 1;
            $input.val(value);
        } else if (value > 30) {
            value = 30;
            $input.val(value);
        }

        // Highlight input nếu đang ở giá trị cận
        if (value <= 1) {
            $input.removeClass('is-valid').addClass('border-warning');
        } else if (value >= 30) {
            $input.removeClass('is-valid').addClass('border-warning');
        } else {
            $input.removeClass('border-warning').addClass('is-valid');
        }

        // Tự động tính toán ngày trả
        calculateFromDays();
    });

    // Xử lý khi focus ra khỏi input số ngày
    $('#soNgayThueInput').on('blur', function () {
        const $input = $(this);
        let value = parseInt($input.val());

        if (isNaN(value) || value < 1) {
            $input.val(1);
            calculateFromDays();
        }
    });

    // Character counter cho ghi chú
    $('#GhiChu').on('input', function () {
        const maxLength = 500;
        const currentLength = $(this).val().length;
        const remaining = maxLength - currentLength;

        // Hiển thị số ký tự còn lại
        if (!$(this).next('.char-counter').length) {
            $(this).after('<small class="char-counter text-muted"></small>');
        }

        const $counter = $(this).next('.char-counter');
        $counter.text('Còn lại ' + remaining + ' ký tự');

        if (remaining < 50) {
            $counter.removeClass('text-muted').addClass('text-warning');
        }
        if (remaining < 10) {
            $counter.removeClass('text-warning').addClass('text-danger');
        }
    });

    // Log để debug
    console.log('Real-time validation và tùy chọn nhanh đã được load');
});