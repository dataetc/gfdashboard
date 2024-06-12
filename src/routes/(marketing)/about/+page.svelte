<script>
  let text = "Your text goes here"
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

<div class="flex">
  <div class="w-1/2 p-6 pt-20">
    <div class="text-4xl md:text-7xl font-bold px-10">
      A Global Fund that
      <span
        class="underline decoration-secondary decoration-4 md:decoration-[6px]"
        >listens</span
      >
    </div>
    <div class="mt-6 md:mt-10 text-lg md:text-xl px-10 pr-40">
      Communities most impacted by HIV, tuberculosis, and malaria are at the
      heart of the Global Fund model.
      <br /><br />
      Join us on this journey, where every contribution counts towards a brighter
      future for all. Let's navigate the path to progress, hand in hand, through
      the Global Fund Dashboard.
    </div>
  </div>
  <div class="w-1/2 pt-20">
    <div
      class="bg-white"
      style="background-image: url('/images/about2.jpg'); background-size: contain; background-repeat: no-repeat; background-position: center; min-height: 110vh;"
    ></div>
  </div>
</div>
<div class="w-full" style="height: 1px; background-color: white;"></div>
<div class="w-full relative" style="height: 500px;">
  <img
    src="/images/about_waves.jpg"
    alt="Additional Image"
    style="width: 100%; height: 100%; object-fit: cover;"
  />
  <div
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold"
  >
    Explore Resources
  </div>
  <a
    href="/resources"
    class="absolute top-2/3 left-1/2 transform -translate-x-1/2 btn btn-primary btn-lg rounded-full text-white min-w-[200px] min-h-[50px]"
  >
    View Resources
  </a>
</div>
