browser.contextMenus.create({
  id: "linkfree-replace",
  title: "Replace with link",
  contexts: ["editable"]
})

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const actions = {
    "linkfree-replace": linkfreeReplace,
  }
  try {
    await actions[info.menuItemId](tab.id)
  } catch (e) {
    console.error("linkfree", e.message)
  }
})

async function linkfreeReplace(tabId) {
  const results = await browser.tabs.executeScript(tabId, {
    code: "document.activeElement.value"
  })

  const searchPhrase = results[0]
  if (!searchPhrase) {
    throw new Error("Couldn't get search phrase")
  }

  const bookmarkItems = await browser.bookmarks.search(tag)
  if (!bookmarkItems.length) {
    throw new Error("Bookmark not found")
  }

  const url = bookmarkItems[0].url

  await browser.tabs.executeScript(tabId, {
    code: `document.activeElement.value = "${url}"`
  })
}