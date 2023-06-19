<script>
  import Menu from "$lib/site-nav/Menu.svelte";
  import { browser } from "$app/environment";

  let allComponents = Object.keys(import.meta.glob("./**/**.svelte"));
  let allPages = allComponents
    .filter((possiblePage) => possiblePage.includes("+page.svelte"))

    .map((usefulPage) => {
      let cleanedPageName = usefulPage;

      cleanedPageName = cleanedPageName
        .replace("/+page.svelte", "")
        .replace("./", "")
        .replaceAll("/", "|");

      return {
        url: usefulPage.replace("+page.svelte", ""),
        pageTitle: cleanedPageName,
      };
    });

  // turn into class?
  let structuredPages = [];

  /**
   * adds a new page into the structured menu
   * @param {Array} pagesInLevel
   * @param {Array} pageToAdd - includes a list of sub routes of the page
   * @param {string} pageUrl - relative link to page
   */
  function addPage(pagesInLevel, pageToAdd, pageUrl) {
    if (pageToAdd.length === 0) return pagesInLevel;

    let existingPageIndex = pagesInLevel.findIndex(
      (page) => page.name == pageToAdd[0]
    );

    if (existingPageIndex < 0) {
      return [
        ...pagesInLevel,
        {
          name: pageToAdd[0],
          url: pageUrl,
          subPages: addPage([], pageToAdd.splice(1), pageUrl),
        },
      ];
    }

    pagesInLevel[existingPageIndex].subPages = addPage(
      pagesInLevel[existingPageIndex].subPages,
      pageToAdd.splice(1),
      pageUrl
    );
    return pagesInLevel;
  }

  for (let { pageTitle, url } of allPages) {
    let subRoutes = pageTitle.split("|");

    structuredPages = addPage(structuredPages, subRoutes, url);
  }

  if (browser && "serviceWorker" in navigator) {
    addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js");
    });
  }
</script>

<svelte:head>
  <title>rep-counter</title>
  <meta
    name="description"
    content="Navigate to any page created during the development of rep-counter."
  />
</svelte:head>

{#if structuredPages?.length}
  <Menu pagesAtLevel={structuredPages} topLevel />
{/if}
