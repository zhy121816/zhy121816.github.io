// 导航切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 公告弹窗功能
    const announcementModal = document.getElementById('announcementModal');
    const announcementConfirm = document.getElementById('announcementConfirm');
    const announcementDontShow = document.getElementById('announcementDontShow');
    
    function getCookie(name) {
        try {
            const cookies = document.cookie ? document.cookie.split(';') : [];
            for (let i = 0; i < cookies.length; i++) {
                const part = cookies[i].trim();
                if (!part) continue;
                const eqIndex = part.indexOf('=');
                const key = eqIndex >= 0 ? part.slice(0, eqIndex) : part;
                const val = eqIndex >= 0 ? part.slice(eqIndex + 1) : '';
                if (key === name) return decodeURIComponent(val);
            }
        } catch (e) {
            // 忽略 cookie 异常
        }
        return '';
    }

    function setCookie(name, value, maxAgeSeconds) {
        try {
            const encoded = encodeURIComponent(value);
            const maxAge = typeof maxAgeSeconds === 'number' ? `; max-age=${maxAgeSeconds}` : '';
            document.cookie = `${name}=${encoded}${maxAge}; path=/; samesite=lax`;
        } catch (e) {
            // 忽略 cookie 异常
        }
    }

    // 页面加载时显示公告弹窗
    if (announcementModal) {
        try {
            const currentVersion = announcementModal.getAttribute('data-announcement-version') || '';
            const dismissedVersion = localStorage.getItem('announcement_dismissed_version') || '';
            const dismissedCookie = getCookie('announcement_dismissed_version') || '';
            const isDismissed = !!currentVersion && (dismissedVersion === currentVersion || dismissedCookie === currentVersion);
            if (!currentVersion || !isDismissed) {
                announcementModal.classList.add('active');
            }
        } catch (e) {
            announcementModal.classList.add('active');
        }
    }
    
    // 确定按钮点击事件
    if (announcementConfirm) {
        announcementConfirm.addEventListener('click', function() {
            if (announcementModal) {
                try {
                    const currentVersion = announcementModal.getAttribute('data-announcement-version') || '';
                    if (announcementDontShow && announcementDontShow.checked && currentVersion) {
                        localStorage.setItem('announcement_dismissed_version', currentVersion);
                        // 同时写 cookie，避免部分环境 localStorage 不持久化
                        setCookie('announcement_dismissed_version', currentVersion, 60 * 60 * 24 * 365);
                    } else {
                        // 未勾选则清除“已读版本”，下次仍会提醒
                        localStorage.removeItem('announcement_dismissed_version');
                        setCookie('announcement_dismissed_version', '', 0);
                    }
                } catch (e) {
                    // 忽略 localStorage 异常
                }
                announcementModal.classList.remove('active');
            }
        });
    }
    
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    function showSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        const btn = document.querySelector('.nav-btn[data-section="' + sectionId + '"]');
        if (btn) btn.classList.add('active');
        target.classList.add('active');
    }
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            showSection(this.getAttribute('data-section'));
        });
    });
    
    // 若 URL 带 #栏目id（如 #comments、#games、#projects）则直接显示对应栏目
    var hash = window.location.hash.slice(1);
    if (hash) {
        var targetSection = document.getElementById(hash);
        if (targetSection && targetSection.classList.contains('section')) {
            showSection(hash);
        }
    }
    
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card, .article-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // 添加页面加载动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有卡片
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // 留言区前端校验：最多 1024 字符，最多 32 行换行
    const commentTextarea = document.getElementById('comment_content');
    const commentForm = document.querySelector('.comment-form');
    const commentSubmit = commentForm ? commentForm.querySelector('.comment-submit') : null;
    if (commentTextarea && commentSubmit) {
        const MAX_LEN = 1024;
        const MAX_LINES = 32;

        function validateComment() {
            const value = commentTextarea.value || '';
            const length = value.length;
            const newlineCount = (value.match(/\n/g) || []).length;
            const tooLong = length > MAX_LEN;
            const tooManyLines = newlineCount > MAX_LINES;
            const empty = value.trim() === '';

            const invalid = empty || tooLong || tooManyLines;
            commentSubmit.disabled = invalid;
        }

        commentTextarea.addEventListener('input', validateComment);
        // 初始也校验一次
        validateComment();
    }

    // 每 1 分钟检查一次是否被封禁（若被封则自动刷新/下线）
    setInterval(() => {
        fetch('check-ban.php', {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store'
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.banned) {
                    // 被封禁后刷新页面，触发后端逻辑显示未登录状态
                    window.location.reload();
                }
            })
            .catch(() => {
                // 忽略网络错误
            });
    }, 60000);
});
