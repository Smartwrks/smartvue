/*
 * Drop this file on any site, add a <div data-askai ...></div>, and include this script.
 */

(function () {
    'use strict';

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
    function parseList(val) {
        if (!val) return undefined;
        if (Array.isArray(val)) return val;
        return String(val).split(',').map(s => s.trim()).filter(Boolean);
    }
    function parseJSON(val) {
        if (!val) return undefined;
        try { return JSON.parse(val); } catch { return undefined; }
    }

    // Get defaults from the <script> tag (so you can set data-endpoint on the script once for the whole page)
    const currentScript = document.currentScript;
    const globalDefaults = {
        queryParam: (currentScript && currentScript.dataset.queryParam) || 'query',
        storageKey: (currentScript && currentScript.dataset.storageKey) || '', // e.g., 'askai_q' to persist between pages
        autoSubmit: (currentScript && currentScript.dataset.autoSubmit) === 'true',
    };

    // Find first non-transparent background color up the DOM tree
    function getNearestSurfaceColor(el) {
        let n = el;
        while (n) {
            const bg = getComputedStyle(n).backgroundColor;
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
            n = n.parentElement;
        }
        // fallback to body or white
        return getComputedStyle(document.body).backgroundColor || '#fff';
    }

    function applySurfaceColors() {
        document.querySelectorAll('.smart-askai').forEach(el => {
            el.style.setProperty('--surface-color', getNearestSurfaceColor(el));
        });
    }

    function showMoreText() {
        document.querySelectorAll('.smart-askai').forEach(el => {
            el.style.setProperty('--blur-height', 'none');
            el.style.setProperty('max-height', 'none');
        });
        var showMore = document.querySelectorAll('.smart-show-more');
        showMore[0].style.display = 'none';
    }

    function loadIconLibrary(cdnUrl) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = cdnUrl;
        document.head.appendChild(linkElement);
    }

    loadIconLibrary('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
	loadIconLibrary('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

    // Stlying
    const CSS = `
    .smart-askai{
        --clip: 100px;
        --blur-height: 215px;
        --fade-depth: 56px;
    }

    .smart-askai{
        display:grid;
        grid-template-columns:2fr 1fr;
        gap:20px;
        position:relative;
        padding-bottom:var(--blur-height);
        max-height:calc(var(--clip));
        overflow:hidden;
        transition:max-height 250ms ease;
    }

    .smart-askai::after{
        content:"";
        position:absolute;
        inset-inline:0;
        bottom:0;
        height:var(--blur-height);
        pointer-events:none;
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
        mask-image:linear-gradient(to top, black, transparent);
        -webkit-mask-image:linear-gradient(to top, black, transparent);
        background:var(--surface-color, inherit);
    }
	.smart-header{
		margin-top:20px;
	}
	.ai-overview-icon{
		margin-right: 8px;
		color: #1aa79c;
		font-size: 1.25rem;
	}
	.ai-overview-icon > span {
		font-style:normal;
    align-items: center;
    margin-bottom: 16px;
    font-size: 1.25rem;
    font-weight: bold;
    color: #3c4043;
	}
    .smart-grid-item{
        background: rgba(26, 167, 156, .1);
		border: 1px solid rgba
		#1aa79c33
		(26, 167, 156, .2);
    border-radius: 20px;
    padding: 12px 16px;
    margin-bottom: 8px;
    transition: all .2s ease;
    cursor: pointer;
    }
	.smart-grid-item:hover{
		background: rgba(26, 167, 156, .15);
    transform: translateY(-1px);
	}
	.smart-show-more-container{
		text-align:center !important;
	}
	.smart-show-more {
		color: #1aa79c;
		border-color: #1aa79c;
		background-color: #ffffff;
		border: solid 2px;
	}
	.smart-show-more:hover {
		background-color: #1aa79c !important;
		border-color: #1aa79c !important;
		color: white !important;
	}

    .hidden-loading {
  display: none !important;
}

#loadingSpinner {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's on top */
  text-align: center;
  display:grid;
  place-items:center;
}

.spinner {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #004579;
  border-right-color: #004579;
  animation: spin 1s linear infinite;
  display:inline-block;
}

.spinner::before,
.spinner::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: 4px solid transparent;
  inset: 6px;
}

.spinner::before {
  border-top-color: #004579;
  border-left-color: #004579;
  animation: spin 2s linear infinite reverse;
}

.spinner::after {
  border-bottom-color: #1aa79c;
  animation: spin 3s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0turn);
	}
	100% {
		transform: rotate(1turn);
	}
}
    
    .initial-state{opacity:0;transform:translateY(20px)}
    .final-state{opacity:1;transform:translateY(0);transition:opacity 0.5s ease-out, transform 0.5s ease-out;}
  `;

    function ensureStyles() {
        if ($('#askai-widget-styles')) return;
        const style = document.createElement('style');
        style.id = 'askai-widget-styles';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function mountWidget(host) {
        // opts for individual div
        const opts = {
            queryParam: host.dataset.queryParam || globalDefaults.queryParam,
            storageKey: host.dataset.storageKey || globalDefaults.storageKey,
            autoSubmit: (host.dataset.autoSubmit || (globalDefaults.autoSubmit ? 'true' : 'false')) === 'true',
            inputSelector: host.dataset.inputSelector || globalDefaults.inputSelector,
            buttonSelector: host.dataset.buttonSelector || globalDefaults.buttonSelector,
            formSelector: host.dataset.formSelector || globalDefaults.formSelector,
            outputSelector: host.dataset.outputSelector || globalDefaults.outputSelector,
            buttonText: host.dataset.buttonText || globalDefaults.buttonText,
			relatedItems: (host.dataset.relatedItems || (globalDefaults.relatedItems ? 'true' : 'false')) === 'true',
            preventDefault: (host.dataset.preventDefault || (globalDefaults.preventDefault ? 'true' : 'false')) === 'true',
            apiKey: host.dataset.apiKey || globalDefaults.apiKey
        };

        const root = opts.shadow ? host.attachShadow({ mode: 'open' }) : host;

        async function callApi(query) {
            const payload = {
                query,
                format: 'html',
                conversationId: opts.conversationId,
                apiKey: opts.apiKey
            };

            const res = await fetch("https://api.ai12z.net/bot/askai", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${payload.apiKey}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error((data && (data.error || data.message)) || res.statusText || 'Request failed');

            let text = '';
            if (typeof data === 'string') text = data;
            else if (data.answer) text = data.answer;
            else if (data.content) text = data.content;
            else if (data.output) text = data.output;
            else if (data.result) text = data.result;
            else text = JSON.stringify(data, null, 2);

            var context = data.context;
            var returnObj = {
                answer: data.answer,
                itemOne: context[0].metadata,
                itemTwo: context[2].metadata,
                itemThree: context[4].metadata
            }
            return returnObj;
        }

        // Hook into existing form/button/input on page
        const attachMode = !!(opts.inputSelector || opts.formSelector || opts.buttonSelector);
        if (attachMode) {
            ensureStyles();
            const inputEl = opts.inputSelector ? document.querySelector(opts.inputSelector) : null;
            const buttonEl = opts.buttonSelector ? document.querySelector(opts.buttonSelector) : null;
            const formEl = opts.formSelector ? document.querySelector(opts.formSelector) : null;
            let outputEl = opts.outputSelector ? document.querySelector(opts.outputSelector) : null;

            if (!outputEl) {
                // Fallback output area appended to host
                outputEl = document.createElement('div');
                outputEl.className = 'askai-output';
                host.appendChild(outputEl);
            }
            const statusEl = document.createElement('div');
            statusEl.id = 'loadingSpinner';
            statusEl.className = 'hidden-loading';
            statusEl.innerHTML = '<span>Generating...</span><div class="spinner"></div>';
            outputEl.prepend(statusEl);

            async function sendFromExisting() {
                const query = inputEl ? String(inputEl.value || '').trim() : '';
				
				var askAi = document.querySelectorAll('.smart-askai');
				var showAi = document.querySelectorAll('.smart-show-more');
				var headerAi = document.querySelectorAll('.smart-header');
				
				 askAi.forEach(element => {
					element.remove();
				});
				
				showAi.forEach(element => {
					element.remove();
				});
				
				headerAi.forEach(element => {
					element.remove();
				});
				
                if (!query) { statusEl.textContent = 'Please enter a query.'; return; }
                statusEl.classList.remove('hidden-loading');
                try {
                    const itemObj = await callApi(query);
                    if ((host.dataset.render || globalDefaults.render) === 'html') {
                        outputEl.appendChild(text);
                    } else {
                        var outputText = document.createElement('div');
                        outputText.classList.add('smart-askai');
                        outputText.classList.add('initial-state');

                        var headerTitle = document.createElement('div');
						headerTitle.classList.add('smart-header');
                        headerTitle.innerHTML = '<i class=\'bi bi-lightbulb-fill ai-overview-icon\'><span>AI Overview</span>';

                        var answerText = document.createElement('div');
						answerText.classList.add('smart-answer');
						
                        requestAnimationFrame(applySurfaceColors);

                        answerText.innerHTML = itemObj.answer;
						
						// clean up formatting
						answerText.querySelectorAll('li').forEach(el => {
							el.querySelectorAll('p').forEach(p => {
								const spanEl = document.createElement('span');
								spanEl.innerHTML = p.innerHTML;
								p.replaceWith(spanEl);
							});
						});
						
						if (opts.relatedItems) {
							var related = document.createElement('div');
							var relatedHeader = document.createElement('h5');
							relatedHeader.textContent = 'Related Content';
							related.appendChild(relatedHeader);

							related.classList.add('smart-grid-container');

							var row = document.createElement('div');
							row.classList.add('smart-grid-row');

							var colOne = document.createElement('div')
							colOne.classList.add('smart-grid-item');
							var colTwo = document.createElement('div')
							colTwo.classList.add('smart-grid-item');
							var colThree = document.createElement('div')
							colThree.classList.add('smart-grid-item');

							colOne.innerHTML = '<a target=\'_blank\' href=\'' + itemObj.itemOne.url + '\'>' + itemObj.itemOne.title + '</a><br>' + itemObj.itemOne.description;
							colTwo.innerHTML = '<a target=\'_blank\' href=\'' + itemObj.itemTwo.url + '\'>' + itemObj.itemTwo.title + '</a><br>' + itemObj.itemTwo.description;
							colThree.innerHTML = '<a target=\'_blank\' href=\'' + itemObj.itemThree.url + '\'>' + itemObj.itemThree.title + '</a><br>' + itemObj.itemThree.description;

							row.appendChild(colOne);
							row.appendChild(colTwo);
							row.appendChild(colThree);

							related.appendChild(row);						
						}

                        outputText.appendChild(answerText);
						
						if (opts.relatedItems) {
							outputText.appendChild(related);
						}
						
                        outputEl.prepend(outputText);
                        outputEl.prepend(headerTitle);

						var showMoreContainer = document.createElement('div');
						showMoreContainer.classList.add('smart-show-more-container');
						outputText.after(showMoreContainer);
						
                        var showMore = document.createElement('button');
                        showMore.classList.add('smart-show-more');
                        showMore.innerText = 'Show More';
                        showMore.addEventListener('click', showMoreText);
                        showMoreContainer.appendChild(showMore);


                        setTimeout(() => {
                            outputText.classList.remove('initial-state');
                            outputText.classList.add('final-state');
                        }, 0);
                    }
                    statusEl.classList.add('hidden-loading');
                } catch (err) {
                    statusEl.textContent = 'Error: ' + (err && err.message ? err.message : String(err));
                }
            }

            if (formEl) {
                formEl.addEventListener('submit', function (e) {
                    const qVal = inputEl ? String(inputEl.value || '').trim() : '';
                    // If we're navigating away (preventDefault=false) and storageKey is set, stash query for next page
                    if (!opts.preventDefault && opts.storageKey && qVal) {
                        try { sessionStorage.setItem(opts.storageKey, qVal); } catch { }
                    }
                    if (opts.preventDefault) {
                        e.preventDefault();
                        sendFromExisting();
                    }
                });
            }
            if (buttonEl) {
                buttonEl.addEventListener('click', function (e) {
                    const qVal = inputEl ? String(inputEl.value || '').trim() : '';
                    if (!opts.preventDefault && opts.storageKey && qVal) {
                        try { sessionStorage.setItem(opts.storageKey, qVal); } catch { }
                    }
                    if (opts.preventDefault) {
                        e.preventDefault();
                        sendFromExisting();
                    }
                });
            }

            // On landing page (after redirect), auto-read query from URL or sessionStorage
            const urlQ = (function () { try { return new URLSearchParams(location.search).get(opts.queryParam); } catch { return null; } })();
            const stashedQ = (opts.storageKey ? (function () { try { return sessionStorage.getItem(opts.storageKey); } catch { return null; } })() : null);
            const initialQ = urlQ || stashedQ || '';
            if (inputEl && initialQ) { inputEl.value = initialQ; }
            if (stashedQ && opts.storageKey) { try { sessionStorage.removeItem(opts.storageKey); } catch { } }

            if ((initialQ || (inputEl && inputEl.value.trim()))) {
                sendFromExisting();
            }

            return;
        }

        async function send() {
            const query = input.value.trim();
            if (!query) { status.textContent = 'Please enter a question.'; return; }
            btn.disabled = true;
            status.textContent = 'Thinking…';
            try {
                const text = await callApi(query);
                output.innerHTML = text;
                status.textContent = '';
            } catch (err) {
                status.textContent = 'Error: ' + (err && err.message ? err.message : String(err));
            } finally {
                btn.disabled = false;
            }
        }

        btn.addEventListener('click', send);
        input.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                send();
            }
        });
    }

    function init() {
        ensureStyles();
        $all('[data-askai]').forEach(mountWidget);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
