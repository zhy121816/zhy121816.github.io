// script.js
// 背景切换功能
document.addEventListener('DOMContentLoaded', function() {
    const bgToggleBtn = document.getElementById('bg-toggle-btn');
    const bgOptions = document.getElementById('bg-options');
    const bgOptionsList = document.querySelectorAll('.bg-option');
    const body = document.body;
    
    // 默认背景类
    const defaultBgClass = 'bg-default';
    
    // 从localStorage读取保存的背景
    const savedBg = localStorage.getItem('selectedBackground') || defaultBgClass;
    
    // 如果保存的背景不是默认，应用它
    if (savedBg !== defaultBgClass) {
        // 移除所有背景类
        body.className = '';
        
        // 应用保存的背景
        if (savedBg.startsWith('solid-')) {
            // 纯色背景
            body.style.background = getSolidBackground(savedBg);
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundAttachment = 'fixed';
        } else {
            // 图片背景
            body.classList.add(savedBg);
        }
    } else {
        // 默认背景
        body.classList.add(defaultBgClass);
    }
    
    // 标记当前激活的背景选项
    bgOptionsList.forEach(option => {
        if (option.dataset.bg === savedBg) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 切换背景选项显示/隐藏
    bgToggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        bgOptions.classList.toggle('show');
    });
    
    // 点击背景选项切换背景
    bgOptionsList.forEach(option => {
        option.addEventListener('click', function() {
            const bgClass = this.dataset.bg;
            
            // 移除所有背景类和内联样式
            body.className = '';
            body.style.background = '';
            body.style.backgroundSize = '';
            body.style.backgroundPosition = '';
            body.style.backgroundAttachment = '';
            
            // 添加新的背景
            if (bgClass.startsWith('solid-')) {
                // 纯色背景
                body.style.background = getSolidBackground(bgClass);
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundAttachment = 'fixed';
            } else {
                // 图片背景
                body.classList.add(bgClass);
            }
            
            // 更新激活状态
            bgOptionsList.forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            
            // 保存到localStorage
            localStorage.setItem('selectedBackground', bgClass);
            
            // 隐藏选项面板
            setTimeout(() => {
                bgOptions.classList.remove('show');
            }, 300);
        });
    });
    
    // 点击页面其他地方关闭背景选项
    document.addEventListener('click', function(e) {
        if (!bgOptions.contains(e.target) && !bgToggleBtn.contains(e.target)) {
            bgOptions.classList.remove('show');
        }
    });
    
    // 防止点击选项时事件冒泡
    bgOptions.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 纯色背景函数
    function getSolidBackground(bgType) {
        const backgrounds = {
            'solid-dark': 'linear-gradient(135deg, #0a0f1e 0%, #1a1f3e 100%)',
            'solid-blue': 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
            'solid-purple': 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)',
            'solid-green': 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)'
        };
        return backgrounds[bgType] || backgrounds['solid-dark'];
    }
    
    // 背景切换按钮动画效果
    bgToggleBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'rotate(90deg)';
    });
    
    bgToggleBtn.addEventListener('mouseleave', function() {
        if (!bgOptions.classList.contains('show')) {
            this.style.transform = 'rotate(0)';
        }
    });
    
    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'b') {
            // Alt + B 切换背景面板
            e.preventDefault();
            bgOptions.classList.toggle('show');
        }
        
        if (e.altKey && e.key >= '1' && e.key <= '3') {
            // Alt + 1/2/3 快速切换背景
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            if (bgOptionsList[index]) {
                bgOptionsList[index].click();
            }
        }
        
        if (e.altKey && e.key === '4') {
            // Alt + 4 切换到纯色背景1
            e.preventDefault();
            const solidOption = document.querySelector('[data-bg="solid-dark"]');
            if (solidOption) solidOption.click();
        }
        
        if (e.altKey && e.key === '5') {
            // Alt + 5 切换到纯色背景2
            e.preventDefault();
            const solidOption = document.querySelector('[data-bg="solid-blue"]');
            if (solidOption) solidOption.click();
        }
    });
    
    // 显示键盘快捷键提示
    console.log('🎨 背景切换快捷键:');
    console.log('Alt + B - 显示/隐藏背景选择器');
    console.log('Alt + 1 - 地球');
    console.log('Alt + 2 - 天安门');
    console.log('Alt + 3 - CPU');
    console.log('Alt + 4 - 深色渐变');
    console.log('Alt + 5 - 蓝色渐变');
    
    // 添加交互效果
    // 为每个小方块添加点击效果
    const blocks = document.querySelectorAll('.block:not(.disable)');
    blocks.forEach(block => {
        block.addEventListener('click', function() {
            // 添加点击反馈
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // 添加背景动画效果
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.random() * 100 + 150}, ${Math.random() * 100 + 150}, 255, ${Math.random() * 0.5 + 0.2})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '100vh';
        particle.style.zIndex = '1';
        particle.style.pointerEvents = 'none';
        document.body.appendChild(particle);
        
        // 粒子动画
        const animation = particle.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(-${Math.random() * 50 + 50}vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 3000,
            easing: 'cubic-bezier(0.2, 0, 0.8, 1)'
        });
        
        animation.onfinish = () => {
            particle.remove();
        };
    };
    
    // 创建一些背景粒子
    for (let i = 0; i < 100; i++) {
        setTimeout(() => createParticle(), i * 300);
    }
    
    // 定期创建新粒子
    setInterval(createParticle, 2000);
});