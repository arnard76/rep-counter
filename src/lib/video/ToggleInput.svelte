<script>
  export let toggle = false;
</script>

<div
  class="container"
  on:click={() => (toggle = !toggle)}
  on:keypress={() => (toggle = !toggle)}
>
  <div class="toggle-option" class:selected={!toggle} />
  <div class="toggle-option" class:selected={toggle} />
</div>

<style>
  * {
    --width: 50px;
    --height: 20px;
  }

  .container {
    height: var(--height);
    width: var(--width);
    background-color: grey;
    border-radius: 25px;

    display: flex;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
  }

  .toggle-option {
    height: calc(var(--height) * 0.5);
    width: calc(var(--height) * 0.5);
    background-color: darkgrey;
    border-radius: 50%;
  }

  .toggle-option.selected {
    background-color: rgb(44, 217, 44);
  }
</style>
