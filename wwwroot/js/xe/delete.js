// Hiển thị thông báo TempData nếu có
@if (TempData["Error"] != null) {
    <text>
        toastr.error('@TempData["Error"]');
    </text>
}

// Function to show delete confirmation modal
function showDeleteModal() {
    document.getElementById('deleteModal').classList.add('show');
}

// Function to close delete confirmation modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('deleteModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeDeleteModal();
        }
    });
});