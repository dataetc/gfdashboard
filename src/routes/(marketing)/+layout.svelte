<script>
  import "../../app.css"
</script>

<div class="navbar bg-white container mx-auto">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl" href="/"
      >The Global Fund Dashboard</a
    >
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 hidden sm:flex font-bold text-lg">
      <li class="md:mx-2"><a href="/">Home</a></li>
      <li class="md:mx-2"><a href="/resources">Resources</a></li>
      <li class="md:mx-2"><a href="/about">About</a></li>
      <li class="md:mx-2"><a href="/account">Account</a></li>
    </ul>
    <div class="dropdown dropdown-end sm:hidden">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          /></svg
        >
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-bold"
      >
        <li><a href="/about">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/resources">Resources</a></li>
        <li><a href="/account">Account</a></li>
      </ul>
    </div>
  </div>
</div>

<div class="">
  <slot />
</div>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<div class="">
  <div class="border-t max-w-[1000px] mx-auto"></div>
  <footer
    class="footer p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base bg-white"
  >
    <nav>
      <span class="footer-title opacity-80">Explore</span>
      <a class="link link-hover mb-1" href="/about">About</a>
      <a class="link link-hover my-1" href="/resources">Resources</a>
      <a class="link link-hover my-1" href="/contact_us">Contact Us</a>
    </nav>
    <aside>
      <span class="footer-title opacity-80">The Global Fund dashboard</span>
      <a
        class="link link-hover max-w-[260px]"
        href="https://dataetc.org"
        target="_blank"
      >
        <img
          alt="Data Etc Logo"
          src="/images/logo2.jpg"
          class="w-[180px] mb-3 aspect-[384/288]"
        />
        This resource is brought to you by Data Etc.
      </a>
    </aside>
  </footer>
</div>
