// ==UserScript==
// @name            Github Gists：展开/折叠文件
// @name.en         Github Gists: Expand / Collapse Files
// @namespace       https://github.com/maboloshi/UserScripts/
// @version         0.1
// @description     为 GitHub Gists 添加展开或折叠文件的按钮
// @description.en  Add a button to expand or collapse files for GitHub Gists
// @author          maboloshi
// @match           https://gist.github.com/*/*
// @grant           GM_addStyle
// @icon            https://github.githubassets.com/pinned-octocat.svg
// @run-at          document-end
// ==/UserScript==
(function () {
  'use strict';

    // 添加样式
    GM_addStyle(`
        .gist-expand-collapse-btn { margin: 0 0 0 6px; }
        .collapsed { display: none; }
    `);

    function initializeExpandCollapseAll() {
        // 创建 `展开全部` 按钮
        const pageHeadActions = document.querySelector('.pagehead-actions');
        const listItem = document.createElement('li');
        const expandCollapseAllBtn = document.createElement('div');
        expandCollapseAllBtn.classList.add('gist-expand-collapse-all-btn', 'btn', 'btn-sm');
        expandCollapseAllBtn.textContent = '折叠全部';
        listItem.appendChild(expandCollapseAllBtn);
        pageHeadActions.appendChild(listItem);

        const fileHeaders = document.querySelectorAll('.file-header');
        const buttons = document.querySelectorAll('.gist-expand-collapse-btn');

        expandCollapseAllBtn.addEventListener('click', () => {
            const isCollapsed = expandCollapseAllBtn.textContent === '折叠全部';
            expandCollapseAllBtn.textContent = isCollapsed ? '展开全部' : '折叠全部';

            buttons.forEach(button => {
                button.textContent = isCollapsed ? '展开' : '折叠';
            });

            fileHeaders.forEach(fileHeader => {
                const fileContainer = fileHeader.nextElementSibling;
                fileContainer.classList.toggle('collapsed', isCollapsed);
            });
        });
    }

    function initializeButtons() {
        const fileHeaders = document.querySelectorAll('.file-header');

        fileHeaders.forEach(fileHeader => {
            // 创建 折叠/展开 按钮
            const expandCollapseBtn = document.createElement('div');
            expandCollapseBtn.classList.add('gist-expand-collapse-btn', 'btn', 'btn-sm');
            expandCollapseBtn.textContent = '折叠';
            fileHeader.firstElementChild.appendChild(expandCollapseBtn);

            const fileContainer = fileHeader.nextElementSibling;

            expandCollapseBtn.addEventListener('click', () => {
                const isCollapsed = expandCollapseBtn.textContent === '折叠';
                expandCollapseBtn.textContent = isCollapsed ? '展开' : '折叠';
                fileContainer.classList.toggle('collapsed', isCollapsed);
            });
        });
    }

    // 初始化折叠/展开按钮
    initializeButtons();
    // 初始化折叠/展开全部按钮
    initializeExpandCollapseAll();
})();
