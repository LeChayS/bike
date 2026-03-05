// Global variables for image gallery
let currentImageIndex = 0;
let totalImages = 0;
let imageList = [];
let modalCurrentIndex = 0;

// Show image detail modal
function showImageModal() {
    modalCurrentIndex = currentImageIndex;
    updateModalImage();

    const modal = new bootstrap.Modal(document.getElementById('imageDetailModal'));
    modal.show();
}

// Update modal image
function updateModalImage() {
    if (imageList.length === 0) return;

    const currentImage = imageList[modalCurrentIndex];
    const modalImage = document.getElementById('modalDetailImage');
    const modalTitle = document.getElementById('modalImageTitle');
    const modalDescription = document.getElementById('modalImageDescription');
    const modalCurrentIndexSpan = document.getElementById('modalCurrentIndex');
    const modalTotalImagesSpan = document.getElementById('modalTotalImages');

    // Update image
    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.description || '@Model.TenXe';

    // Update info
    modalTitle.textContent = '@Model.TenXe';
    modalDescription.textContent = currentImage.description || 'Không có mô tả';
    modalCurrentIndexSpan.textContent = modalCurrentIndex + 1;
    modalTotalImagesSpan.textContent = totalImages;

    // Update navigation buttons
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');

    if (prevBtn) prevBtn.disabled = modalCurrentIndex === 0;
    if (nextBtn) nextBtn.disabled = modalCurrentIndex === totalImages - 1;
}

// Modal navigation functions
function modalPreviousImage() {
    if (modalCurrentIndex > 0) {
        modalCurrentIndex--;
        updateModalImage();
    }
}

function modalNextImage() {
    if (modalCurrentIndex < totalImages - 1) {
        modalCurrentIndex++;
        updateModalImage();
    }
}

// Download image function
function downloadImage() {
    const currentImage = imageList[modalCurrentIndex];
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = `${@Html.Raw(Json.Serialize(Model.TenXe))}_${modalCurrentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Share image function
function shareImage() {
    const currentImage = imageList[modalCurrentIndex];
    const shareData = {
        title: '@Model.TenXe',
        text: `Xem hình ảnh xe @Model.TenXe - ${currentImage.description || ''}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback - copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Đã copy link trang vào clipboard!');
        });
    }
}

// Add modal keyboard navigation
document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('imageDetailModal');
    if (modal && modal.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            modalPreviousImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            modalNextImage();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();
        }
    }
});

// Initialize image gallery
document.addEventListener('DOMContentLoaded', function () {
    initializeImageGallery();
});

function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    totalImages = thumbnails.length;

    // Build image list
    imageList = Array.from(thumbnails).map((thumb, index) => ({
        src: thumb.src,
        description: thumb.getAttribute('data-description') || '',
        index: index
    }));

    // Set initial active image
    const activeThumb = document.querySelector('.thumbnail.active');
    if (activeThumb) {
        const activeSrc = activeThumb.src;
        currentImageIndex = imageList.findIndex(img => img.src === activeSrc);
        if (currentImageIndex === -1) currentImageIndex = 0;
    }

    // Update counter and description
    updateImageInfo();
    updateNavigationButtons();

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextImage();
        }
    });
}

// Enhanced image change function
function changeImage(src, description = '', index = 0) {
    const mainImage = document.getElementById('mainImage');
    const imageDescription = document.getElementById('imageDescription');

    mainImage.style.opacity = '0.5';

    setTimeout(() => {
        mainImage.src = src;
        mainImage.style.opacity = '1';

        // Update description
        if (imageDescription) {
            imageDescription.textContent = description || '';
            imageDescription.className = description ? 'image-description' : 'image-description empty';
        }

        // Update current index
        currentImageIndex = index - 1; // Convert to 0-based index
        if (currentImageIndex < 0) currentImageIndex = 0;
        if (currentImageIndex >= totalImages) currentImageIndex = totalImages - 1;

        updateImageInfo();
        updateNavigationButtons();
    }, 150);

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(img => {
        img.classList.remove('active');
    });

    // Find and activate the correct thumbnail
    const clickedThumb = Array.from(document.querySelectorAll('.thumbnail'))
        .find(thumb => thumb.src === src);
    if (clickedThumb) {
        clickedThumb.classList.add('active');
    }
}

// Navigate to previous image
function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        const prevImage = imageList[currentImageIndex];
        changeImageByIndex(currentImageIndex);
    }
}

// Navigate to next image
function nextImage() {
    if (currentImageIndex < totalImages - 1) {
        currentImageIndex++;
        const nextImage = imageList[currentImageIndex];
        changeImageByIndex(currentImageIndex);
    }
}

// Change image by index
function changeImageByIndex(index) {
    if (index >= 0 && index < totalImages) {
        const image = imageList[index];
        const mainImage = document.getElementById('mainImage');
        const imageDescription = document.getElementById('imageDescription');

        mainImage.style.opacity = '0.5';

        setTimeout(() => {
            mainImage.src = image.src;
            mainImage.style.opacity = '1';

            // Update description
            if (imageDescription) {
                imageDescription.textContent = image.description || '';
                imageDescription.className = image.description ? 'image-description' : 'image-description empty';
            }

            updateImageInfo();
            updateNavigationButtons();
            updateActiveThumbnail(index);
        }, 150);
    }
}

// Update image counter and info
function updateImageInfo() {
    const currentIndexSpan = document.getElementById('currentImageIndex');
    const totalImagesSpan = document.getElementById('totalImages');

    if (currentIndexSpan) {
        currentIndexSpan.textContent = currentImageIndex + 1;
    }
    if (totalImagesSpan) {
        totalImagesSpan.textContent = totalImages;
    }
}

// Update navigation buttons state
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');

    if (prevBtn) {
        prevBtn.disabled = currentImageIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentImageIndex === totalImages - 1;
    }
}

// Update active thumbnail
function updateActiveThumbnail(index) {
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            nextImage();
        } else {
            // Swipe right - previous image
            previousImage();
        }
    }
}

// Add touch event listeners
document.addEventListener('DOMContentLoaded', function () {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.addEventListener('touchstart', handleTouchStart, false);
        mainImage.addEventListener('touchend', handleTouchEnd, false);
    }
});

// Enhanced booking function with error handling
function datGiuXe(maXe) {
    const button = event.target;
    const originalText = button.innerHTML;

    // Check if user is authenticated first
    @if (!User.Identity.IsAuthenticated) {
        <text>
                // If not authenticated, redirect immediately without changing button state
            window.location.href = '@Url.Action("Create", "DatCho", new {id = Model.MaXe})';
            return;
        </text>
    }

    // Only change button state if user is authenticated
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Đang xử lý...';
    button.disabled = true;

    // Store original state for recovery
    button.setAttribute('data-original-text', originalText);

    // Auto-reset button after 10 seconds as fallback
    const resetTimeout = setTimeout(() => {
        resetBookingButton(button);
    }, 10000);

    // Store timeout ID for cleanup
    button.setAttribute('data-reset-timeout', resetTimeout);

    setTimeout(() => {
        window.location.href = '@Url.Action("Create", "DatCho", new { id = Model.MaXe })';
    }, 500);
}

// Function to reset booking button to original state
function resetBookingButton(button) {
    if (!button) return;

    // Get original text from data attribute or determine from context
    let originalText = button.getAttribute('data-original-text');

    if (!originalText) {
        // Determine original text based on button context
        if (button.innerHTML.includes('cart-plus') || button.innerHTML.includes('Thêm vào danh sách')) {
            originalText = '<i class="bi bi-cart-plus"></i> Thêm vào danh sách';
        } else if (button.innerHTML.includes('calendar-check') || button.innerHTML.includes('Đặt ngay')) {
            originalText = '<i class="bi bi-calendar-check"></i> Đặt ngay';
        } else {
            // Find the button's original content by looking at similar buttons
            const status = '@Model.TrangThai';
            if (status === 'Sẵn sàng') {
                if (button.classList.contains('btn-primary-custom')) {
                    originalText = '<i class="bi bi-calendar-check"></i> Đặt ngay';
                } else {
                    originalText = '<i class="bi bi-cart-plus"></i> Thêm vào danh sách';
                }
            } else {
                originalText = '<i class="bi bi-x-circle"></i> Xe đang được thuê';
            }
        }
    }

    button.innerHTML = originalText;
    button.disabled = false;

    // Clear the timeout if it exists
    const timeoutId = button.getAttribute('data-reset-timeout');
    if (timeoutId) {
        clearTimeout(parseInt(timeoutId));
        button.removeAttribute('data-reset-timeout');
    }
}

// Enhanced modal show function
function showQuickBookingModal(maXe) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    document.getElementById('ngayNhanXe').value = today.toISOString().split('T')[0]; // Sửa: lấy ngày hôm nay
    document.getElementById('ngayTraXe').value = dayAfter.toISOString().split('T')[0];

    document.getElementById('ngayNhanXe').min = today.toISOString().split('T')[0];
    document.getElementById('ngayTraXe').min = tomorrow.toISOString().split('T')[0];

    calculatePrice();

    // Show modal with animation
    const modal = new bootstrap.Modal(document.getElementById('quickBookingModal'));
    modal.show();
}

// Enhanced date change handlers
document.getElementById('ngayNhanXe').addEventListener('change', function () {
    const ngayNhanXe = new Date(this.value);
    ngayNhanXe.setDate(ngayNhanXe.getDate() + 1);
    document.getElementById('ngayTraXe').min = ngayNhanXe.toISOString().split('T')[0];

    const ngayTraXe = document.getElementById('ngayTraXe').value;
    if (ngayTraXe && new Date(ngayTraXe) <= new Date(this.value)) {
        document.getElementById('ngayTraXe').value = ngayNhanXe.toISOString().split('T')[0];
    }

    calculatePrice();
});

document.getElementById('ngayTraXe').addEventListener('change', calculatePrice);

// Enhanced price calculation
function calculatePrice() {
    const ngayNhanXe = document.getElementById('ngayNhanXe').value;
    const ngayTraXe = document.getElementById('ngayTraXe').value;

    if (ngayNhanXe && ngayTraXe) {
        const startDate = new Date(ngayNhanXe);
        const endDate = new Date(ngayTraXe);
        const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (dayDiff > 0) {
            const giaThue = @Model.GiaThue;

            // Tính giá thuê đơn giản: giá thuê * số ngày
            const tongTien = dayDiff * giaThue;

            document.getElementById('soNgayThue').textContent = dayDiff;
            document.getElementById('tongTien').textContent = tongTien.toLocaleString() + 'đ';

            // Add animation
            const elements = [document.getElementById('soNgayThue'), document.getElementById('tongTien')];
            elements.forEach(el => {
                el.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                }, 200);
            });
        } else {
            document.getElementById('soNgayThue').textContent = '0';
            document.getElementById('tongTien').textContent = '0đ';
        }
    }
}

// Enhanced add to cart function
function addToCart() {
    const ngayNhanXe = document.getElementById('ngayNhanXe').value;
    const ngayTraXe = document.getElementById('ngayTraXe').value;
    const ghiChu = document.getElementById('ghiChu').value;

    if (!ngayNhanXe || !ngayTraXe) {
        showNotification('Vui lòng chọn ngày nhận và trả xe', 'warning');
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;

    // Store original text for recovery
    button.setAttribute('data-original-text', originalText);

    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Đang thêm...';
    button.disabled = true;

    $.ajax({
        url: '@Url.Action("Add", "Cart")',
        type: 'POST',
        data: {
            maXe: @Model.MaXe,
            ngayNhanXe: ngayNhanXe,
            ngayTraXe: ngayTraXe,
            ghiChu: ghiChu,
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        success: function (response) {
            if (response.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('quickBookingModal'));
                modal.hide();
                showNotification(response.message, 'success');
                updateCartBadge(response.cartItemCount);
            } else {
                showNotification(response.message, 'error');
            }
        },
        error: function () {
            showNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        },
        complete: function () {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}

// Enhanced notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'danger'} notification`;
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                box-shadow: var(--shadow-lg);
                border-radius: var(--border-radius);
                animation: slideIn 0.3s ease-out;
            `;

    notification.innerHTML = `
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'x-circle'}"></i>
                ${message}
                <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
            `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Enhanced cart badge update
function updateCartBadge(count) {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-flex';
            badge.style.animation = 'bounce 0.5s ease-out';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
            @@keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @@keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @@keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
document.head.appendChild(style);

// Reset all booking buttons to their original state
function resetAllBookingButtons() {
    // Reset "Đặt ngay" buttons
    const bookingButtons = document.querySelectorAll('[onclick*="datGiuXe"]');
    bookingButtons.forEach(button => {
        if (button.disabled || button.innerHTML.includes('Đang xử lý')) {
            resetBookingButton(button);
        }
    });

    // Reset "Thêm vào danh sách" buttons
    const cartButtons = document.querySelectorAll('[onclick*="showQuickBookingModal"]');
    cartButtons.forEach(button => {
        if (button.disabled || button.innerHTML.includes('Đang thêm') || button.innerHTML.includes('Đang xử lý')) {
            resetBookingButton(button);
        }
    });

    // Reset any buttons with loading states
    const loadingButtons = document.querySelectorAll('button[disabled], button:contains("Đang")');
    loadingButtons.forEach(button => {
        if (button.innerHTML.includes('Đang ') &&
            (button.innerHTML.includes('xử lý') || button.innerHTML.includes('thêm'))) {
            resetBookingButton(button);
        }
    });
}

// Auto-reset buttons when page becomes visible again (back button)
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        resetAllBookingButtons();
    }
});

// Reset buttons when page is shown (includes back button navigation)
window.addEventListener('pageshow', function (event) {
    resetAllBookingButtons();
});

// Reset buttons on page load
document.addEventListener('DOMContentLoaded', function () {
    resetAllBookingButtons();
});

// Also reset when focus returns to the window
window.addEventListener('focus', function () {
    resetAllBookingButtons();
});