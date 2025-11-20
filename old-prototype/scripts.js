// 获取当前时间并更新到状态栏
function updateStatusBarTime() {
    const timeElement = document.querySelector('.status-bar-time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// 更新激活的导航项
function updateActiveTab() {
    const currentPage = window.location.pathname.split('/').pop();
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
}

// 模拟3D扫描过程
function simulateScan() {
    const scanButton = document.getElementById('start-scan');
    const scanStatus = document.getElementById('scan-status');
    const scanProgress = document.getElementById('scan-progress');
    const scanComplete = document.getElementById('scan-complete');
    
    if (scanButton && scanStatus && scanProgress) {
        scanButton.style.display = 'none';
        scanStatus.style.display = 'block';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            scanProgress.style.width = `${progress}%`;
            scanProgress.textContent = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    scanStatus.style.display = 'none';
                    if (scanComplete) {
                        scanComplete.style.display = 'block';
                    }
                }, 500);
            }
        }, 800);
    }
}

// 颜色选择器功能
function initColorPicker() {
    const colorOptions = document.querySelectorAll('.color-option');
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// 自定义选项滑块功能
function initSliders() {
    const sliders = document.querySelectorAll('input[type="range"]');
    if (sliders.length > 0) {
        sliders.forEach(slider => {
            const output = document.getElementById(slider.getAttribute('data-output'));
            if (output) {
                output.textContent = slider.value;
                slider.addEventListener('input', function() {
                    output.textContent = this.value;
                });
            }
        });
    }
}

// 图表初始化（成长记录）
function initGrowthChart() {
    const growthChartElem = document.getElementById('growth-chart');
    if (growthChartElem && typeof Chart !== 'undefined') {
        new Chart(growthChartElem, {
            type: 'line',
            data: {
                labels: ['1岁', '2岁', '3岁', '4岁', '5岁', '6岁'],
                datasets: [{
                    label: '足长 (cm)',
                    data: [11, 13, 15, 17, 19, 21],
                    borderColor: '#007aff',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    updateStatusBarTime();
    updateActiveTab();
    initColorPicker();
    initSliders();
    initGrowthChart();
    
    // 定时更新状态栏时间
    setInterval(updateStatusBarTime, 60000);
    
    // 处理扫描按钮点击
    const scanButton = document.getElementById('start-scan');
    if (scanButton) {
        scanButton.addEventListener('click', simulateScan);
    }
});

// 简单的页面导航逻辑
function navigateTo(page) {
    window.location.href = page;
} 