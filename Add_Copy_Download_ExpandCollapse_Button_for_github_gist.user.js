// ==UserScript==
// @name            Github Gists：添加复制、下载和展开/折叠文件按钮
// @name.en         Github Gists: Add copy, download and expand/collapse file buttons
// @namespace       https://github.com/maboloshi/UserScripts/
// @version         0.1
// @description     为 GitHub Gists 添加复制、下载和展开/折叠文件按钮
// @description.en  Adds copy, download and expand/collapse file buttons for GitHub Gists
// @author          maboloshi
// @match           https://gist.github.com/*/*
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_download
// @icon            https://github.githubassets.com/pinned-octocat.svg
// @run-at          document-end
// ==/UserScript==

(function () {
  'use strict';

  // 添加样式
  GM_addStyle(`
    .gist-expand-collapse-btn { margin: 0 0 0 6px; }
    .collapsed { display: none; }
    .showNotification { position: fixed; left: 20px; bottom: 5px; z-index: 999; }
  `);

  // 将文本复制到剪贴板
  function copyToClipboard(text) {
    try {
      GM_setClipboard(text);
      console.log('复制成功');
      showNotification('复制成功');
    } catch (error) {
      console.log('复制失败', error);
      showNotification('复制失败');
    }
  }

  // 下载文件
  function downloadFile(url, filename) {
    GM_download({
      url: url,
      name: filename
    });
  }

  // 显示通知
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('showNotification');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  // 创建按钮
  function createButton(text, tooltip) {
    const button = document.createElement('div');
    button.classList.add('btn', 'btn-sm', 'tooltipped', 'tooltipped-sw');
    button.textContent = text;
    button.setAttribute('aria-label', tooltip);
    return button;
  }

  // 初始化按钮
  function initializeButtons() {
    const files = document.querySelectorAll('.file');

    files.forEach(file => {
      const fileAction = file.querySelector('.file-actions');

      // 创建复制按钮
      const copyBtn = createButton('复制', '复制原始文件');
      fileAction.appendChild(copyBtn);

      copyBtn.addEventListener('click', () => {
        const fileContent = file.querySelector('[name="gist[content]"]').innerHTML;
        copyToClipboard(fileContent);
      });

      // 创建下载按钮
      const downloadBtn = createButton('下载', '下载原始文件');
      fileAction.appendChild(downloadBtn);

      downloadBtn.addEventListener('click', () => {
        const url = fileAction.firstElementChild.href;
        const filename = file.querySelector('.gist-blob-name').textContent.trim();
        downloadFile(url, filename);
      });

      // 创建折叠/展开按钮
      const expandCollapseBtn = createButton('折叠', '折叠/展开文件');
      expandCollapseBtn.classList.add('gist-expand-collapse-btn');
      fileAction.appendChild(expandCollapseBtn);

      const fileContainer = file.children[1];

      expandCollapseBtn.addEventListener('click', () => {
        const isCollapsed = expandCollapseBtn.textContent === '折叠';
        expandCollapseBtn.textContent = isCollapsed ? '展开' : '折叠';
        fileContainer.classList.toggle('collapsed', isCollapsed);
      });
    });
  }

  // 初始化折叠/展开全部按钮
  function initializeExpandCollapseAll() {
    const pageHeadActions = document.querySelector('.pagehead-actions');
    const expandCollapseAllBtn = createButton('折叠全部', '折叠/全部');
    // expandCollapseAllBtn.classList.add('gist-expand-collapse-all-btn');
    const listItem = document.createElement('li');
    listItem.appendChild(expandCollapseAllBtn);
    pageHeadActions.appendChild(listItem);

    const fileContainers = document.querySelectorAll('.Box-body');
    const buttons = document.querySelectorAll('.gist-expand-collapse-btn');

    expandCollapseAllBtn.addEventListener('click', () => {
      const isCollapsed = expandCollapseAllBtn.textContent === '折叠全部';
      expandCollapseAllBtn.textContent = isCollapsed ? '展开全部' : '折叠全部';

      buttons.forEach(button => {
        button.textContent = isCollapsed ? '展开' : '折叠';
      });

      fileContainers.forEach(fileContainer => {
        fileContainer.classList.toggle('collapsed', isCollapsed);
      });
    });
  }

  // 初始化按钮和折叠/展开全部按钮
  initializeButtons();
  initializeExpandCollapseAll();
})();
