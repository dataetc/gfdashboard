<script>
  import { writable } from "svelte/store"
  import { onMount } from "svelte"
  import { features } from "$lib/features" // Load the dashboard information

  // Import the user session information
  export let data
  let { session, supabase } = data
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

{#if data.profile.default_country}
  <p>Default country: {data.profile.default_country}</p>
{:else}
  <p>Loading...</p>
{/if}

<h1 class="text-2xl font-bold mb-1">Welcome to Your Dashboard</h1>

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

<style>
  .dashboard-links {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1064px;
    margin: auto;
  }

  .dashboard-links li {
    flex: none;
  }

  .dashboard-link {
    display: inline-block;
    padding: 24px;
    min-width: 270px;
    min-height: 300px;
    background-color: #ffffff;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    text-align: center;
    text-decoration: none;
    color: #333333;
    transition: background-color 0.3s ease;
  }

  .dashboard-link:hover {
    background-color: #f0f0f0;
  }

  .dashboard-link svg {
    margin-top: 12px;
    margin-bottom: 8px;
  }

  .dashboard-link .card-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .dashboard-link p {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .dashboard-link button {
    padding: 8px 16px;
    border-radius: 20px;
    border: 2px solid #4a90e2;
    color: #4a90e2;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  .dashboard-link button:hover {
    background-color: #4a90e2;
    color: #ffffff;
  }
</style>
