<script>
  import Menu from "$lib/site-nav/Menu.svelte";
  import { browser } from "$app/environment";

  let allPages = Object.keys(import.meta.glob("./**/**.svelte"));
  let usefulPages = allPages
    .filter((possiblePage) => {
      if (possiblePage.includes("+layout.svelte")) return;
      if (!possiblePage.includes("+page.svelte")) return;
      return true;
    })
    .map((usefulPage) => {
      let cleanedPageName = usefulPage;

      cleanedPageName = cleanedPageName
        .replace("+page.svelte", "")
        .replace("./", "")
        .replaceAll("/", "|");

      cleanedPageName = cleanedPageName.substring(
        0,
        cleanedPageName.length - 1
      );

      console.log("ting", cleanedPageName);
      return {
        url: usefulPage.replace("+page.svelte", ""),
        pageTitle: cleanedPageName,
      };
    });

  // turn into class?
  let structuredMenu = [];

  /**
   * adds a new page into the structured menu
   * @param {Array} structuredMenu
   * @param {Array} pageToAdd - includes a list of sub routes of the page
   */
  function addAPage(structuredMenu, pageToAdd) {
    let existingStructuredPage = structuredMenu.findIndex((structuredPage) => {
      console.log(structuredPage);
      return structuredPage.name === pageToAdd[0];
    });
    console.log(existingStructuredPage, pageToAdd);

    if (existingStructuredPage !== -1) {
      let existingRoute = pageToAdd.splice(0, 1)[0];
      console.log("existing", existingStructuredPage, existingRoute);
      structuredMenu[existingStructuredPage].subPages = addAPage(
        structuredMenu[existingStructuredPage].subPages,
        pageToAdd
      );
    } else {
      let remainingSubRoutes = pageToAdd.slice(1);
      let subPages = !remainingSubRoutes.length
        ? []
        : addAPage([], remainingSubRoutes);

      structuredMenu.push({
        name: pageToAdd[0],
        subPages,
      });
    }
    return structuredMenu;
  }

  $: if (usefulPages) {
    for (let usefulPage of usefulPages) {
      let subRoutes = usefulPage.pageTitle.split("|");
      //   subRoutes.pop();
      //   let lastRoute = subRoutes.pop();
      //   console.log(usefulPage, subRoutes, lastRoute);

      structuredMenu = addAPage(structuredMenu, subRoutes);
      //   console.log(structuredMenu);
    }
  }

  //   if (browser) {
  //     structuredMenu = addAPage(structuredMenu, ["cool", "beans"]);
  //   }
  $: console.log(structuredMenu);
</script>

<svelte:head>
  <title>rep-counter</title>
  <meta
    name="description"
    content="Navigate to any page created during the development of rep-counter."
  />
</svelte:head>

{#if usefulPages}
  {#each usefulPages as { url, pageTitle } (url)}
    <p>
      <a href={url}>{pageTitle}</a>
    </p>
  {/each}
  <!-- <Menu structuredPages={structuredMenu} /> -->
{/if}
