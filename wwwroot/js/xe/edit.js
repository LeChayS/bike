let selectedNewFiles = [];

// Preview main image
function previewMainImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview-content').innerHTML =
                '<img src="' + e.target.result + '" alt="Preview" />' +
                '<span class="current-image-badge">Ảnh mới</span>';
        }
        reader.readAsDataURL(file);
    }
}

// Preview multiple new images
function previewMultipleImages(event) {
    const files = Array.from(event.target.files);
    addNewFilesToPreview(files);
}

function addNewFilesToPreview(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            selectedNewFiles.push(file);
        }
    });

    updateNewImagePreview();
    updateUploadStats();
}

function updateNewImagePreview() {
    const grid = document.getElementById('newImagePreviewGrid');
    grid.innerHTML = '';

    selectedNewFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const div = document.createElement('div');
            div.className = 'new-image-preview-item';
            div.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}" />
                        <button type="button" class="remove-btn" onclick="removeNewImage(${index})">
                            <i class="bi bi-x"></i>
                        </button>
                        <div class="file-name">${file.name}</div>
                    `;
            grid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeNewImage(index) {
    selectedNewFiles.splice(index, 1);
    updateNewImagePreview();
    updateUploadStats();
    updateNewFileInput();
}

function updateNewFileInput() {
    const dt = new DataTransfer();
    selectedNewFiles.forEach(file => dt.items.add(file));
    document.getElementById('hinhAnhKhac').files = dt.files;
}

function updateUploadStats() {
    const statsDiv = document.getElementById('uploadStats');
    const statsText = document.getElementById('statsText');

    if (selectedNewFiles.length === 0) {
        statsDiv.style.display = 'none';
    } else {
        statsDiv.style.display = 'block';
        const totalSize = selectedNewFiles.reduce((sum, file) => sum + file.size, 0);
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        statsText.textContent = `Đã chọn ${selectedNewFiles.length} hình ảnh mới (${totalSizeMB} MB)`;
    }
}

// Delete existing image
function deleteImage(imageId) {
    if (confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
        $.ajax({
            url: '@Url.Action("DeleteImage", "Xe")',
            type: 'POST',
            data: { id: imageId },
            success: function (response) {
                if (response.success) {
                    showNotification(response.message, 'success');
                    location.reload();
                } else {
                    showNotification(response.message, 'error');
                }
            },
            error: function () {
                showNotification('Có lỗi xảy ra khi xóa hình ảnh', 'error');
            }
        });
    }
}

// Set main image
function setMainImage(imageId) {
    $.ajax({
        url: '@Url.Action("SetMainImage", "Xe")',
        type: 'POST',
        data: { id: imageId },
        success: function (response) {
            if (response.success) {
                showNotification(response.message, 'success');
                location.reload();
            } else {
                showNotification(response.message, 'error');
            }
        },
        error: function () {
            showNotification('Có lỗi xảy ra khi đặt hình ảnh chính', 'error');
        }
    });
}

// Update image description
function updateImageDescription(imageId, description) {
    $.ajax({
        url: '@Url.Action("UpdateImageDescription", "Xe")',
        type: 'POST',
        data: { id: imageId, description: description },
        success: function (response) {
            if (response.success) {
                showNotification(response.message, 'success');
            } else {
                showNotification(response.message, 'error');
            }
        },
        error: function () {
            showNotification('Có lỗi xảy ra khi cập nhật mô tả', 'error');
        }
    });
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} notification`;
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-radius: 8px;
                animation: slideIn 0.3s ease-out;
            `;

    notification.innerHTML = `
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'x-circle'}"></i>
                ${message}
                <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
            `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
        addNewFilesToPreview(files);
        updateNewFileInput();
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
    const maXe = @Model.MaXe;
    $('#BienSoXe').on('input', function () {
        clearTimeout(timeout);
        const bienSo = $(this).val();
        const $input = $(this);
        const $error = $input.next('.text-danger');
        if (bienSo.length > 0) {
            timeout = setTimeout(function () {
                $.ajax({
                    url: '@Url.Action("KiemTraBienSo", "Xe")',
                    type: 'GET',
                    data: { bienSoXe: bienSo, maXe: maXe },
                    success: function (result) {
                        if (result === true) {
                            $input.removeClass('is-invalid').addClass('is-valid');
                            $error.text('');
                        } else {
                            $input.removeClass('is-valid').addClass('is-invalid');
                            $error.text(result);
                        }
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

    // Initialize price preview on page load
    const currentPrice = parseInt(priceInput.value);
    if (currentPrice && !isNaN(currentPrice)) {
        pricePreview.innerHTML = '<i class="bi bi-eye"></i> Hiển thị: ' + currentPrice.toLocaleString('vi-VN') + 'đ/ngày';
    }
});