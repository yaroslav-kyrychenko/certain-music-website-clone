'use strict';

function generateYourLibrary() {
  fetch('../your_library_items.json')
    .then((response) => {
      if (!response.ok)
        throw new Error('Your library items response was not ok!');
      return response.json();
    })
    .then((jsonYourLibraryItems) => {
      const arrYourLibraryItems = jsonYourLibraryItems.yourLibraryItems;
      createHtmlForYourLibrary(arrYourLibraryItems);
    })
    .catch((error) => {
      console.error(
        `There was the following problem with the fetch operation (generateYourLibrary): ${error}`
      );
    });
}

function generateRecItemsSection(
  recItemInJson,
  recItemClassInHtml,
  createHtmlFunction
) {
  fetch('../rec-items-for-main-section.json')
    .then((response) => {
      if (!response.ok)
        throw new Error(`The ${recItemInJson} response was not ok!`);
      return response.json();
    })
    .then((jsonAllRecItems) => {
      const arrRecItems = jsonAllRecItems[`${recItemInJson}`];
      createHtmlFunction(recItemClassInHtml, arrRecItems);
    })
    .catch((error) => {
      console.error(
        `There was the following problem with the fetch operation: ${error}`
      );
    });
}

function generateTopItems() {
  generateRecItemsSection(
    'topItems',
    'section-top-items',
    createHtmlForTopItems
  );
}

function generateYourShows() {
  generateRecItemsSection(
    'yourShows',
    'container-rec-items-your-shows',
    createHtmlForRecItems
  );
}

function generateMadeFor() {
  generateRecItemsSection(
    'madeFor',
    'container-rec-items-made-for-you',
    createHtmlForRecItems
  );
}

function generateRecentlyPlayed() {
  generateRecItemsSection(
    'recentlyPlayed',
    'container-rec-items-recently-played',
    createHtmlForRecItems
  );
}

function generateYourTopMixes() {
  generateRecItemsSection(
    'yourTopMixes',
    'container-rec-items-your-top-mixes',
    createHtmlForYourTopMixes
  );
}

function createHtmlForYourLibrary(arrYourLibraryItems) {
  const listYourLibrary = document.querySelector('.list-your-library');
  const libraryItem = document.querySelector('.list-item-your-library');

  arrYourLibraryItems.forEach((objYourLibraryItem, index) => {
    const clonedLibraryItem = libraryItem.cloneNode(true);
    clonedLibraryItem.setAttribute('aria-posinset', index + 1);

    handleImgCloning(
      objYourLibraryItem,
      clonedLibraryItem,
      'img-your-library-item'
    );

    const yourLibraryItemTitle = clonedLibraryItem.querySelector(
      '.text-your-library-item-title'
    );
    yourLibraryItemTitle.textContent = objYourLibraryItem.title;

    const libraryItemDescription = clonedLibraryItem.querySelector(
      '.text-your-library-item-description'
    );
    libraryItemDescription.textContent = objYourLibraryItem.featured
      ? `${objYourLibraryItem.type} • ${objYourLibraryItem.featured}`
      : `${objYourLibraryItem.type}`;

    listYourLibrary.appendChild(clonedLibraryItem);
  });
}

function createHtmlForTopItems(recItemsContainerClass, arrTopItems) {
  const sectionTopItems = document.querySelector(`.${recItemsContainerClass}`);
  const cardTopElForCloning = sectionTopItems.querySelector(
    '.container-top-item-card'
  );

  arrTopItems.forEach((objTopItem) => {
    const clonedTopItem = cardTopElForCloning.cloneNode(true);

    handleProgressBarForTopItems(objTopItem, clonedTopItem);
    handleImgCloning(objTopItem, clonedTopItem, 'img-top-item');

    const topItemTitle = clonedTopItem.querySelector('.top-item-title');
    topItemTitle.textContent = objTopItem.title;
    const linkTopItem = clonedTopItem.querySelector('.link-top-item');
    linkTopItem.title = objTopItem.title;

    sectionTopItems.appendChild(clonedTopItem);
  });
}

function createHtmlForRecItems(recItemsContainerClass, arrRecItems) {
  const containerRecItems = document.querySelector(
    `.${recItemsContainerClass}`
  );
  const recItemElForCloning = containerRecItems.querySelector(
    '.container-rec-item-tile'
  );

  arrRecItems.forEach((objRecItem) => {
    const clonedRecItem = recItemElForCloning.cloneNode(true);

    handleImgCloning(objRecItem, clonedRecItem, 'img-rec-item-cover');

    setItemLinksForAnchors(objRecItem, clonedRecItem);

    const recItemTitle = clonedRecItem.querySelector('.rec-item-title');
    if (recItemTitle) recItemTitle.textContent = objRecItem.title;
    const recItemFeatured = clonedRecItem.querySelector('.rec-item-featured');
    if (recItemFeatured) {
      recItemFeatured.textContent = objRecItem.featured;
    }
    if (!recItemFeatured) {
      handleFeaturedLinksReplacement(objRecItem, clonedRecItem);
    }

    containerRecItems.appendChild(clonedRecItem);
  });
}

function createHtmlForYourTopMixes(recItemsContainerClass, arrRecItems) {
  const containerRecItems = document.querySelector(
    `.${recItemsContainerClass}`
  );
  const recItemElForCloning = containerRecItems.querySelector(
    '.container-rec-item-tile'
  );

  arrRecItems.forEach((objRecItem) => {
    const clonedRecItem = recItemElForCloning.cloneNode(true);

    handleImgCloning(objRecItem, clonedRecItem, 'img-rec-item-cover');

    const itemLink = clonedRecItem.querySelector('.link-rec-item');
    itemLink.href = objRecItem.itemUrl;

    handleFeaturedLinks(objRecItem, clonedRecItem);

    const recItemTitle = clonedRecItem.querySelector('.rec-item-title');
    if (recItemTitle) recItemTitle.textContent = objRecItem.title;
    containerRecItems.appendChild(clonedRecItem);
  });
}

function handleProgressBarForTopItems(objTopItem, clonedTopItem) {
  const containerProgressBar = clonedTopItem.querySelector(
    '.container-progress-bar'
  );

  if (objTopItem.currentProgress) {
    const currentProgressBar = containerProgressBar.querySelector(
      '.top-item-current-progress-bar'
    );
    currentProgressBar.style.width = objTopItem.currentProgress;
  } else {
    containerProgressBar.remove();
  }
}

function handleImgCloning(objTopOrRecItem, clonedTopOrRecItem, imgClass) {
  const imgCover = clonedTopOrRecItem.querySelector(`.${imgClass}`);
  imgCover.src = objTopOrRecItem.imgUrl;
  imgCover.alt = `${objTopOrRecItem.title} cover`;
}

function handleFeaturedLinks(objRecItem, clonedRecItem) {
  const featuredLinks = clonedRecItem.querySelectorAll(
    '.link-rec-item-featured'
  );

  featuredLinks.forEach((featuredLink, index) => {
    featuredLink.href = objRecItem.featuredItemsUrl[index];
    if (index === 0 || index === 1) {
      featuredLink.textContent = `${objRecItem.featured[index]}, `;
    }
    if (index === 2) {
      featuredLink.textContent = `${objRecItem.featured[index]}`;
    }
  });
}

function handleFeaturedLinksReplacement(objRecItem, clonedRecItem) {
  const recLinkItemFeatured = clonedRecItem.querySelector(
    '.link-rec-item-featured'
  );
  const containerRecItemsFeatured = clonedRecItem.querySelector(
    '.container-rec-item-featured-links'
  );
  if (objRecItem.featuredItemUrl) {
    recLinkItemFeatured.textContent = objRecItem.featured;
    recLinkItemFeatured.href = objRecItem.featuredItemUrl;
  } else {
    const recParagraphItemFeatured = document.createElement('p');
    recParagraphItemFeatured.classList.add('rec-item-featured');
    recParagraphItemFeatured.textContent = objRecItem.featured;
    recLinkItemFeatured.replaceWith(recParagraphItemFeatured);
    containerRecItemsFeatured.style.zIndex = '0';
  }
}

function setItemLinksForAnchors(objRecItem, clonedRecItem) {
  const itemLink = clonedRecItem.querySelector('.link-rec-item');
  const itemTitleLink = clonedRecItem.querySelector('.link-rec-item-title');
  itemLink.href = objRecItem.itemUrl;
  if (itemTitleLink) itemTitleLink.href = objRecItem.itemUrl;
}

function toggleNowPlayingHeaderShade() {
  const headerNowPlayingView = document.querySelector(
    '.topbar-now-playing-view'
  );
  const containerScrollableNowPlayingNow = document.querySelector(
    '.container-now-playing-scrollable-part'
  );

  containerScrollableNowPlayingNow.addEventListener('scroll', () => {
    if (containerScrollableNowPlayingNow.scrollTop > 0) {
      headerNowPlayingView.classList.add('topbar-shadow');
    } else {
      headerNowPlayingView.classList.remove('topbar-shadow');
    }
  });
}

function toggleFilteringChipsShade() {
  const headerFilteringChips = document.querySelector(
    '.container-filtering-chips'
  );
  const containerLibraryList = document.querySelector(
    '.container-library-list'
  );

  containerLibraryList.addEventListener('scroll', () => {
    if (containerLibraryList.scrollTop > 0) {
      headerFilteringChips.classList.add('topbar-shadow');
    } else {
      headerFilteringChips.classList.remove('topbar-shadow');
    }
  });
}

generateYourLibrary();
generateTopItems();
generateYourShows();
generateMadeFor();
generateRecentlyPlayed();
generateYourTopMixes();
toggleNowPlayingHeaderShade();
toggleFilteringChipsShade();
