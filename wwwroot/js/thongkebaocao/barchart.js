let barChart = null;
let currentFilter = '7days';
let customStartDate = null;
let customEndDate = null;
let hiddenDatasets = new Set(); // Lưu trữ các dataset đã bị ẩn

// Khởi tạo khi trang load
$(document).ready(function () {
    // Set active filter button
    $('.filter-btn[data-filter="' + currentFilter + '"]').addClass('active');

    // Set default date range (7 days ago to today)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    $('#startDate').val(sevenDaysAgo.toISOString().split('T')[0]);
    $('#endDate').val(today.toISOString().split('T')[0]);

    // Load chart data
    updatePeriodInfo(currentFilter);
    loadChartData(currentFilter);

    // Event listeners cho filter buttons
    $('.filter-btn').on('click', function () {
        const filter = $(this).data('filter');
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = filter;
        customStartDate = null;
        customEndDate = null;
        updatePeriodInfo(filter);
        loadChartData(filter);
    });

    // Event listener cho custom date button
    $('#applyCustomDate').on('click', function () {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        if (!startDate || !endDate) {
            alert('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
            return;
        }

        // Remove active state from filter buttons
        $('.filter-btn').removeClass('active');
        currentFilter = 'custom';
        customStartDate = startDate;
        customEndDate = endDate;
        updatePeriodInfo('custom', startDate, endDate);
        loadChartData('custom', startDate, endDate);
    });

    // Event listener cho legend items để ẩn/hiện datasets
    $('.legend-item').on('click', function () {
        const datasetIndex = parseInt($(this).data('dataset'));
        toggleDataset(datasetIndex);
    });

    // Event listener cho nút reset legend
    $('#resetLegend').on('click', function () {
        resetAllDatasets();
    });
});

function updatePeriodInfo(filter, startDate = null, endDate = null) {
    let periodText = '';

    switch (filter) {
        case 'today':
            periodText = 'Hôm nay (' + new Date().toLocaleDateString('vi-VN') + ')';
            break;
        case '7days':
            periodText = '7 ngày qua';
            break;
        case 'week':
            periodText = 'Tuần này';
            break;
        case 'month':
            periodText = '30 ngày qua';
            break;
        case 'year':
            periodText = '12 tháng qua';
            break;
        case 'custom':
            if (startDate && endDate) {
                const start = new Date(startDate).toLocaleDateString('vi-VN');
                const end = new Date(endDate).toLocaleDateString('vi-VN');
                periodText = 'Từ ' + start + ' đến ' + end;
            }
            break;
    }

    if (periodText) {
        $('#periodInfoText').text(periodText);
        $('#currentPeriodInfo').show();
    } else {
        $('#currentPeriodInfo').hide();
    }
}

function loadChartData(filter, startDate = null, endDate = null) {
    // Hiển thị loading
    $('#loading').show();
    $('#error').hide();
    if (barChart) {
        barChart.destroy();
    }

    var data = { filter: filter };
    if (startDate && endDate) {
        data.startDate = startDate;
        data.endDate = endDate;
    }

    $.ajax({
        url: '@Url.Action("GetBarChartData", "ThongKeBaoCao")',
        type: 'GET',
        data: data,
        success: function (response) {
            $('#loading').hide();

            if (response.success) {
                createBarChart(response);
                updateStatsSummary(response);
            } else {
                $('#error').show().text('Lỗi: ' + response.message);
            }
        },
        error: function () {
            $('#loading').hide();
            $('#error').show().text('Có lỗi xảy ra khi tải dữ liệu');
        }
    });
}

function toggleDataset(datasetIndex) {
    if (hiddenDatasets.has(datasetIndex)) {
        hiddenDatasets.delete(datasetIndex);
        $(`.legend-item[data-dataset="${datasetIndex}"]`).removeClass('hidden');
    } else {
        hiddenDatasets.add(datasetIndex);
        $(`.legend-item[data-dataset="${datasetIndex}"]`).addClass('hidden');
    }

    // Cập nhật chart nếu đã có dữ liệu
    if (barChart) {
        updateChartVisibility();
    }
}

function updateChartVisibility() {
    if (!barChart) return;

    barChart.data.datasets.forEach((dataset, index) => {
        dataset.hidden = hiddenDatasets.has(index);
    });

    barChart.update();
}

function resetAllDatasets() {
    hiddenDatasets.clear();
    $('.legend-item').removeClass('hidden');

    if (barChart) {
        updateChartVisibility();
    }
}

function createBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');

    // Áp dụng trạng thái ẩn/hiện cho datasets
    data.datasets.forEach((dataset, index) => {
        dataset.hidden = hiddenDatasets.has(index);
    });

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Ẩn legend vì đã có legend riêng
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' +
                                new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Thời gian'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Số tiền (VNĐ)'
                    },
                    ticks: {
                        callback: function (value) {
                            return new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                minimumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
}

function updateStatsSummary(data) {
    // Tính tổng các giá trị
    const totals = {
        doanhThuGoc: 0,
        doanhThuSauChiTieu: 0,
        chiTieu: 0,
        thietHai: 0,
        doanhThuThucTe: 0
    };

    data.datasets.forEach((dataset, index) => {
        const sum = dataset.data.reduce((a, b) => a + b, 0);
        switch (index) {
            case 0: totals.doanhThuGoc = sum; break;
            case 1: totals.doanhThuSauChiTieu = sum; break;
            case 2: totals.chiTieu = sum; break;
            case 3: totals.thietHai = sum; break;
            case 4: totals.doanhThuThucTe = sum; break;
        }
    });

    // Format số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Cập nhật HTML
    $('#statsSummary').html(`
                <div class="stat-card">
                    <div class="stat-value">${formatCurrency(totals.doanhThuGoc)}</div>
                    <div class="stat-label">Doanh thu gốc</div>
                </div>
                <div class="stat-card doanh-thu-sau-chi-tieu">
                    <div class="stat-value">${formatCurrency(totals.doanhThuSauChiTieu)}</div>
                    <div class="stat-label">Doanh thu sau chi tiêu</div>
                </div>
                <div class="stat-card chi-tieu">
                    <div class="stat-value">${formatCurrency(totals.chiTieu)}</div>
                    <div class="stat-label">Tổng chi tiêu</div>
                </div>
                <div class="stat-card thiet-hai">
                    <div class="stat-value">${formatCurrency(totals.thietHai)}</div>
                    <div class="stat-label">Tổng thiệt hại</div>
                </div>
                <div class="stat-card doanh-thu-thuc-te">
                    <div class="stat-value">${formatCurrency(totals.doanhThuThucTe)}</div>
                    <div class="stat-label">Doanh thu thực tế</div>
                </div>
            `);
}