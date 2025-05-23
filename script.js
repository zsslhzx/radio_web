document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.content');
    const navItemsMap = {};
    const contentsMap = {};
    navItems.forEach(item => navItemsMap[item.dataset.tab] = item);
    contents.forEach(content => contentsMap[content.id] = content);
    
    // 为跳转到即将播出按钮添加事件监听
    document.getElementById('jump-to-upcoming')?.addEventListener('click', jumpToUpcoming);

    let activeTab = localStorage.getItem('activeTab') || 'about';

    function updateNav(tabId) {
        navItems.forEach(item => item.classList.remove('active'));
        const targetNavItem = navItemsMap[tabId];
        targetNavItem?.classList.add('active');
    }

    function initTabs() {
        contents.forEach(content => content.classList.remove('active'));

        let activeContent = contentsMap[activeTab];

        if (activeContent) {
            activeContent.classList.add('active');
            updateNav(activeTab);
        } else if (contents.length > 0) {
            contents[0].classList.add('active');
            activeTab = contents[0].id;
            localStorage.setItem('activeTab', activeTab);
            updateNav(activeTab);
        }
    }

    function switchTab(tabId) {
        if (tabId === activeTab) return;

        const currentActiveContent = document.querySelector('.content.active');
        const newActiveContent = contentsMap[tabId];

        if (currentActiveContent && newActiveContent) {
            currentActiveContent.classList.remove('active');
            newActiveContent.classList.add('active');
            activeTab = tabId;
            localStorage.setItem('activeTab', tabId);
            updateNav(tabId);
        }
    }

    document.querySelector('.side-nav').addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            const tabId = navItem.dataset.tab;
            if (tabId && tabId !== activeTab) {
                switchTab(tabId);
            }
        }
    });

    initTabs();

    // 页面加载后检查即将播出的期次并更新按钮状态
    updateUpcomingButton();
});

document.querySelectorAll('.period-title').forEach(title => {
    if (!title.textContent.includes('（')) {
        title.classList.add('upcoming');
        const anchor = document.createElement('a');
        anchor.id = `period-${title.querySelector('.period-number').textContent}`;
        title.parentElement.insertBefore(anchor, title);
    }
});

// 在initTabs函数后添加跳转函数
function jumpToUpcoming() {
    const firstUpcoming = document.querySelector('.playlist-period.upcoming'); // 定位到带有 .upcoming 类的整个期次容器
    const jumpButton = document.getElementById('jump-to-upcoming');

    if (firstUpcoming) {
        // 确保元素已经完全渲染
        requestAnimationFrame(() => {
            // 计算更精确的滚动位置，考虑页面头部高度
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const elementPosition = firstUpcoming.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 40;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    } else {
        console.log('未找到即将播出的歌单，更新按钮状态');
        // 如果没有即将播出的歌单，更新按钮文本和状态
        if (jumpButton) {
            jumpButton.textContent = '暂无即将播出歌单';
            jumpButton.disabled = true; // 禁用按钮
            jumpButton.style.opacity = '0.6'; // 降低按钮透明度以示禁用
            jumpButton.style.cursor = 'not-allowed'; // 改变鼠标样式
            jumpButton.style.boxShadow = 'none'; // 移除阴影
        }
    }
}

// 添加一个函数用于在页面加载时或内容更新后检查即将播出的期次并更新按钮状态
function updateUpcomingButton() {
    const firstUpcoming = document.querySelector('.playlist-period.upcoming');
    const jumpButton = document.getElementById('jump-to-upcoming');

    if (jumpButton) {
        if (firstUpcoming) {
            jumpButton.textContent = '跳转到即将播出'; // 恢复按钮文本
            jumpButton.disabled = false; // 启用按钮
            jumpButton.style.opacity = ''; // 恢复默认透明度
            jumpButton.style.cursor = ''; // 恢复默认鼠标样式
            // 恢复按钮阴影 (可以根据原样式或变量设置)
            jumpButton.style.boxShadow = '0 6px 20px rgba(0, 225, 255, 0.15)';

        } else {
            jumpButton.textContent = '暂无即将播出歌单';
            jumpButton.disabled = true;
            jumpButton.style.opacity = '0.6';
            jumpButton.style.cursor = 'not-allowed';
            jumpButton.style.boxShadow = 'none';
        }
    }
}

// 置底按钮功能
const scrollToBottomButton = document.getElementById('scroll-to-bottom');

// 根据滚动位置显示或隐藏按钮
window.addEventListener('scroll', () => {
    const scrollThreshold = 200; // 页面顶部以下多少距离开始显示按钮
    const distanceFromBottom = document.body.offsetHeight - (window.innerHeight + window.scrollY);
    const bottomThreshold = 100; // 页面底部以上多少距离开始隐藏按钮 (可以根据 footer 高度调整)

    // 只有在滚动距离大于顶部阈值且未滚动到底部阈值时显示按钮
    if (window.pageYOffset > scrollThreshold && distanceFromBottom > bottomThreshold) {
        scrollToBottomButton?.classList.add('show');
    } else {
        scrollToBottomButton?.classList.remove('show');
    }
});

// 点击按钮时滚动到底部
scrollToBottomButton?.addEventListener('click', () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // 平滑滚动
    });
});
