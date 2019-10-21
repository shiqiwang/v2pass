chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.pageAction.onClicked.addListener(tab => {
  chrome.storage.sync.get(items => {
    console.log('chrome storage items', items);
  });
});

function test(): void {
  console.log('123');
}

(window as any).test = test;
