<script>
  export let structuredPages = [];

  let menuStyles = "display:flex; background-color:rgb(150, 150, 150); ";
  let verticalStyles = "flex-direction: column; background-color:lightgrey;";

  function createMenu(structuredPage, horizontal = true) {
    let menu = `<li style="${menuStyles} ${
      !horizontal ? verticalStyles : ""
    }"><p><a href="${structuredPage.url}"> ${structuredPage.name}</a></p>
      `;

    for (let page of structuredPage.subPages) {
      //   console.log(page);
      menu = menu + createMenu(page, !horizontal);
    }
    return menu + "</li>";
  }
</script>

{#each structuredPages as structuredPage (structuredPage.name)}
  <ul>
    {@html createMenu(structuredPage)}
  </ul>
{/each}
