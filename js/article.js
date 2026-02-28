// 文章/题解页：代码块复制按钮
// 需要在 HTML 中通过 onclick="copyCode(this)" 调用

function copyCode(button) {
    const codeBlock = button.nextElementSibling;
    const code = codeBlock.querySelector('code');
    const text = code.textContent || code.innerText;

    // 使用 Clipboard API 复制
    navigator.clipboard.writeText(text).then(function() {
        // 复制成功，更新按钮状态
        const textSpan = button.querySelector('.copy-text');
        textSpan.textContent = '已复制';
        button.classList.add('copied');

        // 2秒后恢复
        setTimeout(function() {
            textSpan.textContent = '复制';
            button.classList.remove('copied');
        }, 2000);
    }).catch(function() {
        // 复制失败，使用备用方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const textSpan = button.querySelector('.copy-text');
            textSpan.textContent = '已复制';
            button.classList.add('copied');
            setTimeout(function() {
                textSpan.textContent = '复制';
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            alert('复制失败，请手动复制');
        }
        document.body.removeChild(textArea);
    });
}

// 挂到全局，供 onclick 调用（避免模块/严格模式下不可见）
window.copyCode = copyCode;

// 自动为所有 pre code 块添加复制按钮
document.addEventListener('DOMContentLoaded', function() {
    const preElements = document.querySelectorAll('.article-content pre');
    preElements.forEach(function(pre) {
        // 检查是否已经有复制按钮
        if (pre.parentElement.classList.contains('code-block-wrapper')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.onclick = function() { copyCode(this); };
        copyBtn.title = '复制代码';
        copyBtn.innerHTML = '<span class="copy-text">复制</span>';
        wrapper.insertBefore(copyBtn, pre);
    });
});

