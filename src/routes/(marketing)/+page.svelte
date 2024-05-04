<script lang="ts">
  import { PUBLIC_SITE_NAME } from "$env/static/public"
  import { features } from "$lib/features"
</script>

<svelte:head>
  <title>{PUBLIC_SITE_NAME}</title>
  <meta name="description" content="{PUBLIC_SITE_NAME} Home Page" />
</svelte:head>

<div class="hero min-h-[60vh]">
  <div class="hero-content text-center py-12">
    <div class="max-w-xl">
      <div
        class="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4 md:mb-8"
      >
        Global Data Hub
      </div>

      <div
        class="text-4xl md:text-6xl font-bold px-2"
        style="line-height: 1.2;"
      >
        The
        <span
          class="underline decoration-secondary decoration-4 md:decoration-[6px]"
          >transparent</span
        >, and
        <span
          class="underline decoration-secondary decoration-4 md:decoration-[6px]"
          >free</span
        >
        <span> source of global public health data</span>
      </div>
      <div class="mt-6 md:mt-10 text-sm md:text-lg">
        Supporting people and projects around the world like <a
          href="https://kit.svelte.dev"
          class="link font-bold"
          target="_blank">Community-led monitoring</a
        >,
        <a href="https://supabase.com" class="link font-bold" target="_blank"
          >Data transparency initiatives</a
        >, with data from
        <a href="https://stripe.com" class="link font-bold" target="_blank"
          >the Global Fund</a
        >
      </div>
    </div>
  </div>
</div>
<div class="min-h-[60vh]">
  <div class="pt-20 pb-8 px-7">
    <div class="max-w-lg mx-auto text-center">
      <div
        class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
      >
        Explore a wealth of Global Health Data
      </div>
      <div class="mt-6 text-xl font-bold">
        Try the tools now or
        <span
          class="underline decoration-secondary decoration-[3px] md:decoration-[4px]"
        >
          free user account
        </span>
        to store your preferences, and key insights
      </div>
    </div>

    <div
      class="flex gap-6 mt-12 max-w-[1064px] mx-auto place-content-center flex-wrap"
    >
      {#each features as feature}
        <div class="card bg-white w-[270px] min-h-[300px] flex-none shadow-xl">
          <div class="card-body items-center text-center p-[24px] pt-[32px]">
            <div>
              <svg
                width="50px"
                height="50px"
                class="mb-2 mt-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html feature.svgContent}
              </svg>
            </div>
            <h2 class="card-title">
              {feature.name}
            </h2>
            <p class="text-sm">
              {feature.description}
            </p>
            {#if feature.link}
              <a
                href={feature.link}
                class="pb-4"
                target={feature.newPage ? "_blank" : ""}
              >
                <button
                  class="btn btn-xs btn-outline rounded-full btn-primary min-w-[100px]"
                  >{feature.linkText ? feature.linkText : "Try It"}</button
                >
              </a>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
