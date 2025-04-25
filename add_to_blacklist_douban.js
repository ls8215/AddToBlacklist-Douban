// ==UserScript==
// @name         豆瓣一键拉黑
// @namespace    https://douban.com/
// @version      0.1
// @description  在每条动态下添加拉黑按钮
// @author       爽罗
// @match        https://www.douban.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 从 document.cookie 中获取 ck 值
     * @returns {string} ck 值，如果找不到则返回空字符串
     */
    function getCK() {
        const match = document.cookie.match(/ck=([^;]+)/);
        return match ? match[1] : '';
    }

    /**
     * 创建并返回一个确认拉黑的模态框元素
     * @returns {HTMLElement} 模态框元素
     */
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'blacklist-modal';
        // 设置模态框的 HTML 结构和样式
        modal.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5); z-index: 9999;
                display: flex; align-items: center; justify-content: center;">
                <div style="
                    background: white; padding: 20px 30px; border-radius: 6px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3); position: relative;">
                    <h3 style="margin: 0 0 10px;">确认拉黑？</h3>
                    <p id="modal-message">你确定要拉黑这个用户吗？</p>
                    <div style="margin-top: 20px; text-align: right;">
                        <button id="modal-cancel" style="margin-right: 10px;">取消</button>
                        <button id="modal-confirm">确定</button>
                    </div>
                </div>
            </div>
        `;
        // 初始状态下隐藏模态框
        modal.style.display = 'none';
        // 将模态框添加到 body
        document.body.appendChild(modal);

        return modal;
    }

    // 创建模态框并获取其内部元素
    const modal = createModal();
    const modalMessage = modal.querySelector('#modal-message'); // 模态框消息文本
    const modalCancel = modal.querySelector('#modal-cancel');   // 取消按钮
    const modalConfirm = modal.querySelector('#modal-confirm'); // 确认按钮

    // 用于存储当前要操作的用户信息和动态元素
    let currentTargetUserId = null;
    let currentTargetUserName = null;
    let currentTargetItem = null;

    /**
     * 发送拉黑请求到豆瓣服务器
     * @param {string} userId 要拉黑的用户 ID
     */
    function sendBlacklistRequest(userId) {
        const ck = getCK(); // 获取 ck
        if (!ck) {
            alert('无法获取 ck，拉黑失败');
            return;
        }

        // 构建 POST 请求的表单数据
        const formData = new URLSearchParams();
        formData.append('people', userId);
        formData.append('ck', ck);

        // 发送 fetch 请求
        fetch('https://www.douban.com/j/contact/addtoblacklist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest', // 模拟 AJAX 请求
            },
            body: formData.toString(),
            credentials: 'include', // 包含 cookie
        })
        .then(response => {
            if (response.status === 200) {
                alert('拉黑成功');
                // 如果存在当前操作的动态元素，则将其从页面移除
                if (currentTargetItem) {
                    currentTargetItem.remove(); // 拉黑成功后移除动态
                }
            } else {
                alert('拉黑失败，状态码：' + response.status);
            }
        })
        .catch(error => {
            console.error('请求失败', error);
            alert('拉黑请求出错');
        });
    }

    /**
     * 遍历页面上的动态，为每条动态添加拉黑按钮
     */
    function addBlacklistButtons() {
        // 选择所有动态元素
        const streamItems = document.querySelectorAll('#statuses > div.stream-items > div.new-status');

        streamItems.forEach(item => {
            const userId = item.getAttribute('data-uid'); // 获取用户 ID
            const actions = item.querySelector('.bd .actions'); // 获取操作按钮区域

            // 如果缺少用户 ID 或操作区域，则跳过
            if (!userId || !actions) return;

            let userName = '';

            // 尝试从头像的 alt 属性获取用户名
            const imgAlt = item.querySelector('.usr-pic img[alt]');
            if (imgAlt) {
                userName = imgAlt.getAttribute('alt') || '';
            } else {
                // 如果头像 alt 不存在，尝试从用户链接的 title 属性获取
                const aTitle = item.querySelector('.usr-pic a[title]');
                if (aTitle) {
                    userName = aTitle.getAttribute('title') || '';
                }
            }

            // 如果无法获取用户名，则跳过
            if (!userName) return;

            // 如果已经存在拉黑按钮，则跳过，防止重复添加
            if (actions.querySelector('.btn.blacklist-btn')) return;

            // 创建拉黑按钮元素
            const blacklistBtn = document.createElement('a');
            blacklistBtn.className = 'btn blacklist-btn'; // 设置样式类
            blacklistBtn.href = 'javascript:void(0);'; // 阻止默认链接行为
            blacklistBtn.textContent = '拉黑'; // 按钮文本
            blacklistBtn.style.marginLeft = '5px'; // 添加左边距

            // 为拉黑按钮添加点击事件监听器
            blacklistBtn.addEventListener('click', () => {
                // 存储当前要操作的用户信息和动态元素
                currentTargetUserId = userId;
                currentTargetUserName = userName;
                currentTargetItem = item;
                // 更新模态框提示信息
                modalMessage.textContent = `你确定要拉黑用户「${userName}」吗？`;
                // 显示模态框
                modal.style.display = 'flex';
            });

            // 将拉黑按钮添加到操作区域
            actions.appendChild(blacklistBtn);
        });
    }

    // 为模态框的取消按钮添加点击事件
    modalCancel.onclick = () => {
        modal.style.display = 'none'; // 隐藏模态框
    };
    // 为模态框的确认按钮添加点击事件
    modalConfirm.onclick = () => {
        // 如果存在当前目标用户 ID，则发送拉黑请求
        if (currentTargetUserId) {
            sendBlacklistRequest(currentTargetUserId);
        }
        modal.style.display = 'none'; // 隐藏模态框
    };

    // 添加键盘事件监听器，按下 Esc 键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    // 创建一个 MutationObserver 实例，用于监听 DOM 变化
    const observer = new MutationObserver(() => {
        // 当 DOM 变化时（例如加载更多动态），重新执行添加拉黑按钮的逻辑
        addBlacklistButtons();
    });

    // 配置 MutationObserver 监听整个 body 的子节点变化和子树变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面加载完成后立即执行一次添加拉黑按钮的操作
    addBlacklistButtons();
})();