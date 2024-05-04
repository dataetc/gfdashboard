<script>
  import { writable } from "svelte/store"
  import { onMount } from "svelte"

  // Import the user session information
  export let data
  let { session, supabase } = data

  console.log("data", data.profile.default_country)
  // Store to hold the count of rows
  let userMetadataCount = writable(0)

  // Function to query the entire user_metadata table and count the rows for the current user
  const getUserMetadataCount = async () => {
    try {
      // Get the current user ID from Supabase
      const user = session?.user
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Query to count rows with user_id equal to current user's ID
      const { data, error } = await supabase
        .from("user_metadata")
        .select("*") // Select all columns
        .eq("user_id", user.id)

      console.log("User Metadata Data:", data) // Log the data

      if (error) {
        throw error
      }

      // Update the count in the store
      userMetadataCount.set(data.length)
    } catch (error) {
      console.error("Error fetching user metadata count:", error.message)
    }
  }

  // Function to add user ID to the table
  const addUserToTable = async () => {
    try {
      // Get the current user ID from Supabase
      const user = session?.user
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Add the user ID to the table
      const { data, error } = await supabase
        .from("user_metadata")
        .insert({ user_id: user.id })

      if (error) {
        throw error
      }

      console.log("User added successfully:", data)

      // Update the count after adding user
      await getUserMetadataCount()
    } catch (error) {
      console.error("Error adding user:", error.message)
    }
  }

  let adminSection = writable("home")
  adminSection.set("home")

  // Log session data when the component is mounted
  onMount(() => {
    console.log("Session data:", session)
    // Fetch the initial count of user metadata
    getUserMetadataCount()
  })
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>
{#if data.profile.default_country}
  <p>Default country: {data.profile.default_country}</p>
{:else}
  <p>Loading...</p>
{/if}
<button on:click={addUserToTable}>Add User ID to Table</button>
<h1 class="text-2xl font-bold mb-1">Dashboard</h1>
<!-- Button to add user ID to the table -->

<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Users</h1>
  <div class="stats shadow stats-vertical sm:stats-horizontal sm:w-[420px]">
    <div class="stat place-items-center">
      <div class="stat-title">Downloads</div>
      <div class="stat-value">31K</div>
      <div class="stat-desc">↗︎ 546 (2%)</div>
    </div>

    <div class="stat place-items-center">
      <div class="stat-title">Users</div>
      <div class="stat-value text-secondary">{$userMetadataCount}</div>
      <div class="stat-desc">↗︎ 40 (2%)</div>
    </div>
  </div>
</div>
