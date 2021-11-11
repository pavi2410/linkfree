browser.contextMenus.create({
  id: "linkfree-replace",
  title: "Replace with link",
  contexts: ["editable"]
})

// browser.contextMenus.create({
//   id: "linkfree-save",
//   title: "Save link",
//   contexts: ["editable"]
// })

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const actions = {
    "linkfree-replace": linkfreeReplace,
    // "linkfree-save": linkfreeSave
  }
  try {
    await actions[info.menuItemId](tab.id)
  } catch (e) {
    console.error('linkfree', e.message)
  }
})

async function linkfreeReplace(tabId) {
  const results = await browser.tabs.executeScript(tabId, {
    code: "document.activeElement.value"
  })
  console.log('linkfree', results)
  const token = results[0]
  if (!token) {
    throw new Error('No token found')
  }
  if (!token.startsWith('!')) {
    throw new Error("Token does not start with !")
  }
  const tag = token.substring(1)
  const bookmarkItems = await browser.bookmarks.getSubtree('linkfree')
  const bookmark = bookmarkItems.children.find(b => b.title === tag)
  if (!bookmark) {
    throw new Error("Bookmark not found")
  }
  const url = bookmark.url

  browser.tabs.executeScript(tabId, {
    code: `document.activeElement.value = ${url}`
  })
}

// function linkfreeSave(tabId) {
// }