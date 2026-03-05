let selectedFiles = [];

// Preview main image
function previewMainImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview-content').innerHTML =
                '<img src="' + e.target.result + '" alt="Preview" />';
        }
        reader.readAsDataURL(file);
    }
}

// Preview multiple images
function previewMultipleImages(event) {
    const files = Array.from(event.target.files);
    addFilesToPreview(files);
}

function addFilesToPreview(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            selectedFiles.push(file);
        }
    });

    updateImagePreview();
    updateUploadStats();
}

function updateImagePreview() {
    const grid = document.getElementById('imagePreviewGrid');
    grid.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}" />
                        <button type="button" class="remove-btn" onclick="removeImage(${index})">
                            <i class="bi bi-x"></i>
                        </button>
                        <div class="file-name">${file.name}</div>
                    `;
            grid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    selectedFiles.splice(index, 1);
    updateImagePreview();
    updateUploadStats();
    updateFileInput();
}

function updateFileInput() {
    const dt = new DataTransfer();
    selectedFiles.forEach(file => dt.items.add(file));
    document.getElementById('hinhAnhKhac').files = dt.files;
}

function updateUploadStats() {
    const statsDiv = document.getElementById('uploadStats');
    const statsText = document.getElementById('statsText');

    if (selectedFiles.length === 0) {
        statsDiv.style.display = 'none';
    } else {
        statsDiv.style.display = 'block';
        const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        statsText.textContent = `Đã chọn ${selectedFiles.length} hình ảnh (${totalSizeMB} MB)`;
    }
}

// Drag and drop functionality
document.addEventListener('DOMContentLoaded', function () {
    const uploadArea = document.getElementById('multiImageUpload');

    uploadArea.addEventListener('click', function () {
        document.getElementById('hinhAnhKhac').click();
    });

    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const files = Array.from(e.dataTransfer.files);
        addFilesToPreview(files);
        updateFileInput();
    });
});

// Validation cho các trường bắt buộc
$('input[required], select[required]').on('blur', function () {
    const $input = $(this);
    const $error = $input.next('.text-danger');

    if (!$input.val().trim()) {
        $input.removeClass('is-valid').addClass('is-invalid');
        $error.text('Trường này là bắt buộc');
    } else {
        $input.removeClass('is-invalid').addClass('is-valid');
        $error.text('');
    }
});

// Kiểm tra biển số real-time
$(document).ready(function () {
    let timeout;
    $('#BienSoXe').on('input', function () {
        clearTimeout(timeout);
        const bienSo = $(this).val();
        const $input = $(this);
        const $error = $input.next('.text-danger');
        $input.removeClass('is-valid is-invalid');
        $error.text('');
        if (bienSo.length > 0) {
            timeout = setTimeout(function () {
                $.ajax({
                    url: '@Url.Action("KiemTraBienSo", "Xe")',
                    type: 'GET',
                    data: { bienSoXe: bienSo },
                    success: function (result) {
                        if (result === true) {
                            $input.removeClass('is-invalid').addClass('is-valid');
                            $error.text('');
                        } else {
                            $input.removeClass('is-valid').addClass('is-invalid');
                            $error.text(result);
                        }
                    },
                    error: function () {
                        $input.removeClass('is-valid').addClass('is-invalid');
                        $error.text('Có lỗi xảy ra khi kiểm tra biển số');
                    }
                });
            }, 500);
        }
    });

    // Add live preview for price formatting (display only)
    const priceInput = document.getElementById('GiaThue');
    const pricePreview = document.createElement('small');
    pricePreview.className = 'form-text text-info';
    priceInput.parentNode.parentNode.appendChild(pricePreview);

    priceInput.addEventListener('input', function (e) {
        const value = parseInt(e.target.value);
        const $input = $(this);
        const $error = $input.parent().next('.text-danger');

        // Reset validation state
        $input.removeClass('is-valid is-invalid');
        $error.text('');

        if (value && !isNaN(value)) {
            if (value > 0) {
                $input.removeClass('is-invalid').addClass('is-valid');
                pricePreview.innerHTML = '<i class="bi bi-eye"></i> Hiển thị: ' + value.toLocaleString('vi-VN') + 'đ/ngày';
            } else {
                $input.removeClass('is-valid').addClass('is-invalid');
                $error.text('Giá thuê phải lớn hơn 0');
                pricePreview.innerHTML = '';
            }
        } else {
            pricePreview.innerHTML = '';
        }
    });
});