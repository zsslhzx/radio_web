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
    const firstUpcoming = document.querySelector('.upcoming');
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
        console.warn('未找到即将播出的歌单');
    }
}
