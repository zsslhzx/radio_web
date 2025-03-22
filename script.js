document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.content');
    const navItemsMap = {};
    const contentsMap = {};
    navItems.forEach(item => navItemsMap[item.dataset.tab] = item);
    contents.forEach(content => contentsMap[content.id] = content);

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