// ==UserScript==
// @name            Github Gists: 添加复制、下载和展开/折叠文件按钮，隐藏/显示删除按钮
// @name.en         Github Gists: Add copy, download and expand/collapse file buttons, hide/show delete button
// @namespace       https://github.com/maboloshi/UserScripts/
// @version         0.4
// @description     为 GitHub Gists 添加复制、下载和展开/折叠文件按钮，隐藏/显示删除按钮
// @description.en  Adds copy, download, expand/collapse file buttons and hide/show delete button for GitHub Gists
// @author          maboloshi
// @match           https://gist.github.com/*
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_download
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @icon            https://github.githubassets.com/pinned-octocat.svg
// @run-at          document-end
// ==/UserScript==

(function () {
  'use strict';

  // 添加样式
  GM_addStyle(`
    .gist-expand-collapse-btn {
        margin: 0 0 0 6px;
        display: inline-block;
        padding: 5px;
        line-height: 1;
        color: var(--fgColor-muted, var(--color-fg-muted));
        vertical-align: middle;
        background: transparent;
        border: 0;
        box-shadow: none;
    }
    .gist-expand-collapse-btn:hover {
        color: var(--fgColor-accent, var(--color-accent-fg));
    }
    .gist-file-box-collapsed, .gist-btn-hide { display: none !important; }
    .file-actions.flex-order-2.pt-0 {
        display: inline-flex;
        align-items: center !important;
    }
    a.Button--secondary.Button--small.Button {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }
    .copy-download-btn {
        width: 28px;
        display: grid;
        place-content: center;
    }
    button[aria-label="复制原始文件"] {
        border-radius: 0px;
    }
    button[aria-label="下载原始文件"] {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
    }
    Details-content--hidden, Details-content--shown {
        position: absolute;
    }
  `);

  // 将文本复制到剪贴板
  function copyToClipboard(el, text) {
    if (text && text !== '' && text !== '获取失败' && text !== '网络请求失败') {
      GM_setClipboard(text);
      console.log('✅ 复制成功');
      showNotification(el, '✅ 复制成功');
    } else {
      console.error('❌ 复制失败');
      showNotification(el, '❌ 复制失败');
    }
  }

  // 下载文件
  function downloadFile(el, fileUrl, fileName) {
    GM_download({
      url: fileUrl,
      name: fileName,
      onload: () => {
          console.log('✅ 文件下载完成');
          showNotification(el, '✅ 文件下载完成');
      },
      onerror: (error) => {
          console.error('❌ 下载出错:', error);
          showNotification(el, '❌ 下载出错');
      }
    });
  }

  // 显示通知
  function showNotification(el, message) {
    const originalText = el.getAttribute("aria-label");
    el.setAttribute("aria-label", message);
    setTimeout(() => {
      el.setAttribute("aria-label", originalText);
    }, 2000);
  }

  // 获取原文内容
  function getRawText(fileUrl) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: fileUrl,
        onload: (res) => {
          try {
            const { status, response } = res;
            const rawText = (status === 200) ? response : "";
            resolve(rawText);
          } catch (error) {
            console.error('获取失败', error);
            reject("获取失败");
          }
        },
        onerror: (error) => {
          console.error('网络请求失败', error);
          reject("网络请求失败");
        }
      });
    });
  }

  // 创建按钮
  function createButton(text, tooltip, htmlContent, ...classNames) {
    const button = document.createElement('button');
    button.classList.add('tooltipped', 'tooltipped-n', ...classNames);
    button.textContent = text;
    button.setAttribute('aria-label', tooltip);
    if (htmlContent) {
      button.innerHTML = htmlContent;
    }
    return button;
  }

  // 初始化按钮
  function initButtons() {
    const files = document.querySelectorAll('.file');

    files.forEach(file => {
      const fileAction =file.firstElementChild.firstElementChild;
      const fileUrl = fileAction.firstElementChild.href;
      const fileName = file.querySelector('.gist-blob-name').innerText;

      // 创建复制按钮
      const copyBtn = createButton(
        '复制',
        '复制原始文件',
        `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-copy"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>`,
        'btn', 'copy-download-btn'
      );
      copyBtn.addEventListener('click', async () => {
        const fileBox = file.querySelector('[name="gist[content]"]');
        const fileContent = fileBox?.innerText || await getRawText(fileUrl);
        copyToClipboard(copyBtn, fileContent);
      });
      fileAction.appendChild(copyBtn);

      // 创建下载按钮
      const downloadBtn = createButton(
        '下载',
        '下载原始文件',
        `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" viewBox="0 0 16 16" class="octicon octicon-download"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path><path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path></svg>`,
        'btn', 'copy-download-btn',
      );
      downloadBtn.addEventListener('click', () => {
        downloadFile(downloadBtn, fileUrl, fileName);
      });
      fileAction.appendChild(downloadBtn);

      // 创建折叠/展开按钮
      const expandCollapseBtn = createButton(
        '折叠',
        '折叠文件',
        `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-chevron-down Details-content--hidden"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path></svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-chevron-right Details-content--shown gist-btn-hide"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"></path></svg>
        `,
        'gist-expand-collapse-btn',
      );
      expandCollapseBtn.addEventListener('click', () => {
        const [expandIcon, collapseIcon] = expandCollapseBtn.children;
        const isExpanded = expandCollapseBtn.getAttribute('aria-label') === '折叠文件';

        expandIcon.classList.toggle('gist-btn-hide');
        collapseIcon.classList.toggle('gist-btn-hide');
        expandCollapseBtn.setAttribute('aria-label', isExpanded ? '展开文件' : '折叠文件');
        file.children[1].classList.toggle('gist-file-box-collapsed');
      });
      fileAction.appendChild(expandCollapseBtn);
    });
  }

  // 初始化折叠/展开全部按钮
  function initExpandCollapseAll() {
    const pageHeadActions = document.querySelector('.pagehead-actions');
    const expandCollapseAllBtn = createButton('折叠全部', '折叠全部文件', '', 'btn');
    const listItem = document.createElement('li');
    listItem.appendChild(expandCollapseAllBtn);
    pageHeadActions.appendChild(listItem);

    const fileContainers = document.querySelectorAll('.Box-body');
    const expandCollapseBtns = document.querySelectorAll('.gist-expand-collapse-btn');

    expandCollapseAllBtn.addEventListener('click', () => {
      const isExpandedAll = expandCollapseAllBtn.textContent === '折叠全部';

      expandCollapseAllBtn.textContent = isExpandedAll ? '展开全部' : '折叠全部';
      expandCollapseAllBtn.setAttribute('aria-label', isExpandedAll ? '展开全部文件' : '折叠全部文件');

      expandCollapseBtns.forEach(expandCollapseBtn => {
        const [expandIcon, collapseIcon] = expandCollapseBtn.children;

        expandIcon.classList.toggle('gist-btn-hide', isExpandedAll);
        collapseIcon.classList.toggle('gist-btn-hide', !isExpandedAll);
        expandCollapseBtn.setAttribute('aria-label', isExpandedAll ? '展开文件' : '折叠文件');
      });

      fileContainers.forEach(fileContainer => {
        fileContainer.classList.toggle('gist-file-box-collapsed', isExpandedAll);
      });
    });
  }

  // 显示隐藏删除按钮
  function deleteBtnToggle() {
    const deleteBtn = document.querySelector('.btn-danger.btn-sm.btn');
    if (deleteBtn) {
      deleteBtn.classList.toggle('gist-btn-hide');
    }
  }

  function init() {
    const isGistpage = () => /^https:\/\/gist\.github\.com\/[\w-]+\/[a-f0-9]{32}(?:#)?$/.test(location.href);

    const loadButtons = () => {
      initButtons();
      initExpandCollapseAll();
      deleteBtnToggle();
    }

    // 页面跳转后重新加载
    const reload = () => {
      new window.MutationObserver(mutations => {
        mutations.forEach(mutation => {
          const removedNodes = mutation.removedNodes;
          if (removedNodes.length > 0 && removedNodes[0].matches('div.turbo-progress-bar') && isGistpage()) {
            loadButtons();
            return;
          }
        });
      }).observe(document.documentElement, {
        childList: true
      })
    };

    const load = () => {
      if (isGistpage()) {
          loadButtons();
      }
    }

    load();
    reload();
  }

  // 注册菜单
  GM_registerMenuCommand("显示/隐藏\"删除按钮\"", deleteBtnToggle);

  init();
})();
