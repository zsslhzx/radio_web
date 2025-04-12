document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.content');
    const navItemsMap = {};
    const contentsMap = {};
    navItems.forEach(item => navItemsMap[item.dataset.tab] = item);
    contents.forEach(content => contentsMap[content.id] = content);
    
    // 从localStorage获取当前活动的标签页
    let activeTab = localStorage.getItem('activeTab') || 'about';

    // 识别未播出的排期并添加特殊样式
    const markUpcomingPeriods = () => {
        const periodTitles = document.querySelectorAll('.period-title');
        let hasUpcoming = false;
        let firstUpcomingPeriod = null;
        
        periodTitles.forEach(title => {
            const titleText = title.textContent.trim();
            const periodContainer = title.closest('.playlist-period');
            
            // 检查标题是否不包含日期（括号），如果不包含则标记为未播出
            if (!titleText.includes('（') && !titleText.includes('(')) {
                periodContainer.classList.add('upcoming');
                hasUpcoming = true;
                
                // 记录第一个未播出的排期
                if (!firstUpcomingPeriod) {
                    firstUpcomingPeriod = periodContainer;
                }
                
                // 添加"未播出"标记
                const badge = document.createElement('span');
                badge.className = 'upcoming-badge';
                badge.textContent = '未播出';
                title.appendChild(badge);
            }
        });
        
        // 如果有未播出的排期，添加跳转按钮
        if (hasUpcoming && firstUpcomingPeriod) {
            const playlistContent = document.getElementById('playlist');
            if (playlistContent) {
                const contentCard = playlistContent.querySelector('.content-card');
                if (contentCard) {
                    // 创建跳转按钮
                    const jumpButton = document.createElement('button');
                    jumpButton.className = 'jump-to-upcoming';
                    jumpButton.innerHTML = '🔍 跳转到未播出排期';
                    jumpButton.style.cssText = `
                        display: block;
                        margin: 1rem auto;
                        padding: 0.8rem 1.5rem;
                        background: linear-gradient(135deg, #d8b400, #ffd700);
                        color: white;
                        border: none;
                        border-radius: 30px;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(216,180,0,0.3);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                    
                    // 添加悬停效果
                    jumpButton.addEventListener('mouseover', () => {
                        jumpButton.style.transform = 'translateY(-3px)';
                        jumpButton.style.boxShadow = '0 6px 20px rgba(216,180,0,0.4)';
                    });
                    
                    jumpButton.addEventListener('mouseout', () => {
                        jumpButton.style.transform = 'translateY(0)';
                        jumpButton.style.boxShadow = '0 4px 15px rgba(216,180,0,0.3)';
                    });
                    
                    // 添加点击事件
                    jumpButton.addEventListener('click', () => {
                        firstUpcomingPeriod.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // 添加高亮效果
                        firstUpcomingPeriod.classList.add('highlight');
                        setTimeout(() => {
                            firstUpcomingPeriod.classList.remove('highlight');
                        }, 2000);
                    });
                    
                    // 将按钮插入到内容卡片的开头
                    contentCard.insertBefore(jumpButton, contentCard.firstChild);
                }
            }
        }
    };

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
            
            // 如果切换到歌单公示标签页，执行标记未播出排期的函数
            if (tabId === 'playlist') {
                markUpcomingPeriods();
            }
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
    
    // 如果当前是歌单公示页面，立即执行标记未播出排期的函数
    if (activeTab === 'playlist') {
        markUpcomingPeriods();
    }
});