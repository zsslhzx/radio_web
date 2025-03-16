document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.content');
    // 创建映射以快速查找元素
    const navItemsMap = {};
    const contentsMap = {};
    navItems.forEach(item => navItemsMap[item.dataset.tab] = item);
    contents.forEach(content => contentsMap[content.id] = content);

    let activeTab = localStorage.getItem('activeTab') || 'about';

    // 初始化选项卡
    function initTabs() {
        // 隐藏所有内容
        contents.forEach(content => content.classList.remove('active'));

        // 显示当前选中内容
        let activeContent = contentsMap[activeTab];
        if (activeContent) {
            activeContent.classList.add('active');
        } else {
            // 默认显示第一个并更新存储
            contents[0].classList.add('active');
            activeTab = contents[0].id;
            localStorage.setItem('activeTab', activeTab);
        }

        // 更新导航状态
        navItems.forEach(item => item.classList.remove('active'));
        const targetNavItem = navItemsMap[activeTab] || navItems[0];
        targetNavItem.classList.add('active');
    }

    // 切换选项卡
    function switchTab(tabId) {
        if (tabId === activeTab) return;

        const currentActiveContent = document.querySelector('.content.active');
        const newActiveContent = contentsMap[tabId];
        if (currentActiveContent && newActiveContent) {
            // 移除当前内容激活状态
            currentActiveContent.classList.remove('active');
            // 添加新内容激活状态
            newActiveContent.classList.add('active');
            activeTab = tabId;
            localStorage.setItem('activeTab', tabId);

            // 更新导航状态：直接操作目标元素
            const currentNav = document.querySelector('.nav-item.active');
            currentNav?.classList.remove('active');
            const newNav = navItemsMap[tabId];
            newNav?.classList.add('active');
        }
    }

    // 事件委托：父元素监听点击
    document.querySelector('.side-nav').addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem && !navItem.classList.contains('active')) {
            switchTab(navItem.dataset.tab);
        }
    });

    initTabs();

    // 确保默认激活（冗余检查，initTabs已处理）
    if (!document.querySelector('.content.active')) {
        contents[0].classList.add('active');
    }
});