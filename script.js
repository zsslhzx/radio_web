document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.content');
    let activeTab = localStorage.getItem('activeTab') || 'about';

    // 初始化选项卡
    function initTabs() {
        // 隐藏所有内容
        contents.forEach(content => {
            content.classList.remove('active');
        });

        // 显示当前选中内容
        const activeContent = document.getElementById(activeTab);
        if (activeContent) {
            activeContent.classList.add('active');
        } else {
            // 默认显示第一个选项卡
            contents[0].classList.add('active');
            activeTab = contents[0].id;
        }

        // 更新导航状态
        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.dataset.tab === activeTab) {
                item.classList.add('active');
            }
        });
    }

    // 切换选项卡
    function switchTab(tabId) {
        if (tabId === activeTab) return;

        // 添加转场动画
        const currentActive = document.querySelector('.content.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }

        const newActive = document.getElementById(tabId);
        if (newActive) {
            activeTab = tabId;
            localStorage.setItem('activeTab', tabId);
            newActive.classList.add('active');

            // 更新导航状态
            navItems.forEach(item => {
                item.classList.remove('active');
                if(item.dataset.tab === tabId) {
                    item.classList.add('active');
                }
            });
        }
    }

    // 事件监听（使用事件委托）
    document.querySelector('.side-nav').addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem && !navItem.classList.contains('active')) {
            const tabId = navItem.dataset.tab;
            switchTab(tabId);
        }
    });

    // 初始化执行
    initTabs();

    // 确保默认显示第一个有效内容
    if (!document.querySelector('.content.active')) {
        contents[0].classList.add('active');
    }
});