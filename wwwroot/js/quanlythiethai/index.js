// Modal functions
function showChiTietModal(maThietHai) {
    const modal = document.getElementById('chiTietModal');
    const modalBody = document.getElementById('chiTietModalBody');

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Show loading
    modalBody.innerHTML = `
            <div class="text-center">
                <div class="loading-spinner"></div>
                <p class="mt-2">Đang tải thông tin...</p>
            </div>
        `;

    // Fetch data
    $.get('/QuanLyThietHai/GetChiTiet/' + maThietHai, function (response) {
        if (response.success) {
            const data = response.data;
            modalBody.innerHTML = `
                    <div class="modal-row">
                        <div class="modal-label">Mã thiệt hại:</div>
                        <div class="modal-value">${data.maThietHai}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Loại thiệt hại:</div>
                        <div class="modal-value">
                            <span class="modal-badge ${data.loaiThietHaiClass}">${data.loaiThietHai}</span>
                        </div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Xe:</div>
                        <div class="modal-value">${data.tenXe} (${data.bienSoXe})</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Khách hàng:</div>
                        <div class="modal-value">${data.khachHang}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Số điện thoại:</div>
                        <div class="modal-value">${data.soDienThoai}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">CCCD:</div>
                        <div class="modal-value">${data.cccd}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Địa chỉ:</div>
                        <div class="modal-value">${data.diaChi}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Mô tả:</div>
                        <div class="modal-value">${data.moTaThietHai}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Ngày xảy ra:</div>
                        <div class="modal-value">${data.ngayXayRa}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Trạng thái:</div>
                        <div class="modal-value">
                            <span class="modal-badge ${data.trangThaiClass}">${data.trangThaiXuLy}</span>
                        </div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Phương án xử lý:</div>
                        <div class="modal-value">${data.phuongAnXuLy}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Số tiền đền bù:</div>
                        <div class="modal-value text-success font-weight-bold">${data.soTienDenBu}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Số tiền còn lại:</div>
                        <div class="modal-value text-warning font-weight-bold">${data.soTienConLai}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Ngày hoàn thành:</div>
                        <div class="modal-value">${data.ngayHoanThanh}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Người báo cáo:</div>
                        <div class="modal-value">${data.nguoiBaoCao}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Ngày tạo:</div>
                        <div class="modal-value">${data.ngayTao}</div>
                    </div>
                    <div class="modal-row">
                        <div class="modal-label">Ghi chú:</div>
                        <div class="modal-value">${data.ghiChu}</div>
                    </div>
                `;
        } else {
            modalBody.innerHTML = `
                    <div class="text-center text-danger">
                        <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                        <p class="mt-2">Không thể tải thông tin thiệt hại</p>
                        <p class="text-muted">${response.message || 'Đã xảy ra lỗi'}</p>
                    </div>
                `;
        }
    }).fail(function () {
        modalBody.innerHTML = `
                <div class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                    <p class="mt-2">Không thể kết nối đến máy chủ</p>
                    <p class="text-muted">Vui lòng thử lại sau</p>
                </div>
            `;
    });
}

function closeChiTietModal() {
    const modal = document.getElementById('chiTietModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}



// Delete Modal functions
let currentDeleteId = null;

function showDeleteModal(maThietHai) {
    currentDeleteId = maThietHai;
    const modal = document.getElementById('deleteModal');
    const modalBody = document.getElementById('deleteModalBody');

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Show loading
    modalBody.innerHTML = `
            <div class="text-center">
                <div class="loading-spinner"></div>
                <p class="mt-2">Đang tải thông tin...</p>
            </div>
        `;

    // Fetch data to show confirmation details
    $.get('/QuanLyThietHai/GetChiTiet/' + maThietHai, function (response) {
        if (response.success) {
            const data = response.data;
            modalBody.innerHTML = `
                    <div class="text-center">
                        <div class="mb-3">
                            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #e74c3c;"></i>
                        </div>
                        <h5 class="text-danger mb-3">Bạn có chắc chắn muốn xóa thiệt hại này?</h5>
                        <div class="text-left">
                            <div class="modal-row">
                                <div class="modal-label">Mã thiệt hại:</div>
                                <div class="modal-value">${data.maThietHai}</div>
                            </div>
                            <div class="modal-row">
                                <div class="modal-label">Loại thiệt hại:</div>
                                <div class="modal-value">
                                    <span class="modal-badge ${data.loaiThietHaiClass}">${data.loaiThietHai}</span>
                                </div>
                            </div>
                            <div class="modal-row">
                                <div class="modal-label">Xe:</div>
                                <div class="modal-value">${data.tenXe} (${data.bienSoXe})</div>
                            </div>
                            <div class="modal-row">
                                <div class="modal-label">Mô tả:</div>
                                <div class="modal-value">${data.moTaThietHai}</div>
                            </div>
                            <div class="modal-row">
                                <div class="modal-label">Ngày xảy ra:</div>
                                <div class="modal-value">${data.ngayXayRa}</div>
                            </div>
                        </div>
                        <div class="alert alert-warning mt-3" style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px;">
                            <i class="bi bi-exclamation-triangle"></i>
                            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác!
                        </div>
                    </div>
                `;
        } else {
            modalBody.innerHTML = `
                    <div class="text-center text-danger">
                        <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                        <p class="mt-2">Không thể tải thông tin thiệt hại</p>
                        <p class="text-muted">${response.message || 'Đã xảy ra lỗi'}</p>
                    </div>
                `;
        }
    }).fail(function () {
        modalBody.innerHTML = `
                <div class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                    <p class="mt-2">Không thể kết nối đến máy chủ</p>
                    <p class="text-muted">Vui lòng thử lại sau</p>
                </div>
            `;
    });
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentDeleteId = null;
}

function confirmDelete() {
    if (!currentDeleteId) {
        alert('Không tìm thấy thông tin thiệt hại cần xóa');
        return;
    }

    // Show loading on delete button
    const deleteBtn = document.querySelector('#deleteModal .modal-btn-danger');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<div class="loading-spinner"></div> Đang xóa...';
    deleteBtn.disabled = true;

    // Send delete request
    $.ajax({
        url: '/QuanLyThietHai/Delete/' + currentDeleteId,
        type: 'POST',
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val(),
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function (response) {
            if (response.success) {
                // Show success message
                alert('Thiệt hại đã được xóa thành công!');
                closeDeleteModal();
                // Reload page to refresh data
                location.reload();
            } else {
                alert(response.message || 'Có lỗi xảy ra khi xóa thiệt hại');
            }
        },
        error: function () {
            alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        },
        complete: function () {
            // Restore delete button
            deleteBtn.innerHTML = originalText;
            deleteBtn.disabled = false;
        }
    });
}

// Edit Modal functions
function showEditModal(maThietHai) {
    const modal = document.getElementById('editModal');
    const modalBody = document.getElementById('editModalBody');

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Show loading
    modalBody.innerHTML = `
            <div class="text-center">
                <div class="loading-spinner"></div>
                <p>Đang tải thông tin...</p>
            </div>
        `;

    // Fetch data
    $.get('/QuanLyThietHai/GetChiTiet/' + maThietHai, function (response) {
        if (response.success) {
            const data = response.data;
            modalBody.innerHTML = `
                    <form id="editThietHaiForm">
                        <input type="hidden" id="maThietHai" value="${data.maThietHai}">
                        
                        <div class="custom-form-group">
                            <label class="custom-form-label">Loại thiệt hại *</label>
                            <select id="loaiThietHai" class="custom-form-input custom-form-select" required>
                                <option value="">-- Chọn loại thiệt hại --</option>
                                <option value="Hư hỏng phụ kiện" ${data.loaiThietHai === 'Hư hỏng phụ kiện' ? 'selected' : ''}>Hư hỏng phụ kiện</option>
                                <option value="Hư hỏng thân xe" ${data.loaiThietHai === 'Hư hỏng thân xe' ? 'selected' : ''}>Hư hỏng thân xe</option>
                                <option value="Mất xe" ${data.loaiThietHai === 'Mất xe' ? 'selected' : ''}>Mất xe</option>
                                <option value="Khác" ${data.loaiThietHai === 'Khác' ? 'selected' : ''}>Khác</option>
                            </select>
                            <div class="custom-validation-error" id="loaiThietHaiError">Vui lòng chọn loại thiệt hại</div>
                        </div>
                        
                        <div class="custom-form-group">
                            <label class="custom-form-label">Số tiền đền bù (VNĐ) *</label>
                            <input type="text" id="soTienDenBu" class="custom-form-input" value="${data.soTienDenBu}" required placeholder="Nhập số tiền...">
                            <div class="custom-validation-error" id="soTienDenBuError">Vui lòng nhập số tiền đền bù</div>
                        </div>
                        
                        <div class="custom-form-group">
                            <label class="custom-form-label">Trạng thái xử lý *</label>
                            <select id="trangThaiXuLy" class="custom-form-input custom-form-select" required>
                                <option value="Chưa xử lý" ${data.trangThaiXuLy === 'Chưa xử lý' ? 'selected' : ''}>Chưa xử lý</option>
                                <option value="Đang xử lý" ${data.trangThaiXuLy === 'Đang xử lý' ? 'selected' : ''}>Đang xử lý</option>
                                <option value="Đã xử lý" ${data.trangThaiXuLy === 'Đã xử lý' ? 'selected' : ''}>Đã xử lý</option>
                                <option value="Đã đền bù" ${data.trangThaiXuLy === 'Đã đền bù' ? 'selected' : ''}>Đã đền bù</option>
                            </select>
                            <div class="custom-validation-error" id="trangThaiXuLyError">Vui lòng chọn trạng thái xử lý</div>
                        </div>
                        
                        <div class="custom-form-group">
                            <label class="custom-form-label">Phương án xử lý</label>
                            <textarea id="phuongAnXuLy" class="custom-form-input custom-form-textarea" placeholder="Nhập phương án xử lý...">${data.phuongAnXuLy === 'Chưa có' ? '' : (data.phuongAnXuLy || '')}</textarea>
                        </div>
                        
                        <div class="custom-form-group">
                            <label class="custom-form-label">Ghi chú</label>
                            <textarea id="ghiChu" class="custom-form-input custom-form-textarea" placeholder="Nhập ghi chú...">${data.ghiChu === 'Không có' ? '' : (data.ghiChu || '')}</textarea>
                        </div>
                    </form>
                `;
        } else {
            modalBody.innerHTML = `
                    <div class="text-center text-danger">
                        <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                        <p>Không thể tải thông tin thiệt hại</p>
                        <p class="text-muted">${response.message || 'Đã xảy ra lỗi'}</p>
                    </div>
                `;
        }
    }).fail(function () {
        modalBody.innerHTML = `
                <div class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                    <p>Không thể kết nối đến máy chủ</p>
                    <p class="text-muted">Vui lòng thử lại sau</p>
                </div>
            `;
    });
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showValidationError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');

    field.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearValidationErrors() {
    const errorDivs = document.querySelectorAll('.custom-validation-error');
    const errorFields = document.querySelectorAll('.custom-form-input.error');

    errorDivs.forEach(div => div.style.display = 'none');
    errorFields.forEach(field => field.classList.remove('error'));
}

function saveThietHai() {
    // Validate form
    const maThietHai = document.getElementById('maThietHai').value;
    const loaiThietHai = document.getElementById('loaiThietHai').value;
    const soTienDenBuFormatted = document.getElementById('soTienDenBu').value;
    const soTienDenBu = parseInt(soTienDenBuFormatted.replace(/[^\d]/g, '')) || 0;
    const trangThaiXuLy = document.getElementById('trangThaiXuLy').value;
    const phuongAnXuLy = document.getElementById('phuongAnXuLy').value.trim();
    const ghiChu = document.getElementById('ghiChu').value.trim();

    // Reset validation errors
    clearValidationErrors();

    // Validate required fields
    let isValid = true;

    if (!loaiThietHai) {
        showValidationError('loaiThietHai', 'Vui lòng chọn loại thiệt hại');
        isValid = false;
    }

    if (!soTienDenBu || soTienDenBu <= 0) {
        showValidationError('soTienDenBu', 'Vui lòng nhập số tiền đền bù hợp lệ');
        isValid = false;
    }

    if (!trangThaiXuLy) {
        showValidationError('trangThaiXuLy', 'Vui lòng chọn trạng thái xử lý');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading on save button
    const saveBtn = document.querySelector('#editModal .custom-modal-btn-primary');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<div class="loading-spinner"></div> Đang lưu...';
    saveBtn.disabled = true;

    // Prepare data
    const formData = {
        MaThietHai: parseInt(maThietHai),
        LoaiThietHai: loaiThietHai,
        MoTaThietHai: '', // Không cho phép sửa mô tả
        SoTienDenBu: soTienDenBu,
        TrangThaiXuLy: trangThaiXuLy,
        PhuongAnXuLy: phuongAnXuLy.trim() === '' ? null : phuongAnXuLy,
        GhiChu: ghiChu.trim() === '' ? null : ghiChu
    };

    // Send request
    $.ajax({
        url: '/QuanLyThietHai/Edit/' + maThietHai,
        type: 'POST',
        data: formData,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val(),
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function (response) {
            if (response.success) {
                // Show success message
                alert('Thông tin thiệt hại đã được cập nhật thành công!');
                closeEditModal();
                // Reload page to refresh data
                location.reload();
            } else {
                alert(response.message || 'Có lỗi xảy ra khi cập nhật thông tin');
            }
        },
        error: function () {
            alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        },
        complete: function () {
            // Restore save button
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    });
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    const chiTietModal = document.getElementById('chiTietModal');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');

    chiTietModal.addEventListener('click', function (e) {
        if (e.target === chiTietModal) {
            closeChiTietModal();
        }
    });

    editModal.addEventListener('click', function (e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    deleteModal.addEventListener('click', function (e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (chiTietModal.classList.contains('show')) {
                closeChiTietModal();
            } else if (editModal.classList.contains('show')) {
                closeEditModal();
            } else if (deleteModal.classList.contains('show')) {
                closeDeleteModal();
            }
        }
    });
});

function searchThietHai() {
    var searchTerm = $('#searchInput').val();
    if (searchTerm.trim() === '') {
        alert('Vui lòng nhập từ khóa tìm kiếm');
        return;
    }

    $.post('/QuanLyThietHai/SearchByContent', { searchTerm: searchTerm }, function (response) {
        if (response.success) {
            $('#thietHaiTableBody').html(response.data.rows.join(''));
        } else {
            alert(response.message);
        }
    });
}

function filterByStatus() {
    var status = $('#statusFilter').val();
    $.post('/QuanLyThietHai/FilterByStatus', { trangThai: status }, function (response) {
        if (response.success) {
            $('#thietHaiTableBody').html(response.data.rows.join(''));
        }
    });
}

function resetFilter() {
    $('#searchInput').val('');
    $('#statusFilter').val('Tất cả');
    $.get('/QuanLyThietHai/GetOriginalData', function (response) {
        if (response.success) {
            $('#thietHaiTableBody').html(response.data.rows.join(''));
        }
    });
}

// Xử lý phím Enter trong ô tìm kiếm
$('#searchInput').keypress(function (e) {
    if (e.which == 13) {
        searchThietHai();
    }
});