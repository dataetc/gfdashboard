<script lang="ts">
  import { pricingPlans } from "./resource_details"

  // Module context
  export let highlightedPlanId: string = ""
  export let callToAction: string
  export let currentPlanId: string = ""
  export let center = true

  type PlanFeatureRow = {
    name: string
    header?: boolean
  }

  const planFeatures: PlanFeatureRow[] = []
</script>

<div
  class="flex flex-col lg:flex-row gap-10 {center
    ? 'place-content-center'
    : ''} flex-wrap"
>
  {#each pricingPlans as plan}
    <div
      class="flex-none card card-bordered {plan.id === highlightedPlanId
        ? 'border-primary'
        : 'border-gray-200'} shadow-xl flex-1 flex-grow min-w-[260px] max-w-[310px] p-6"
    >
      <div class="flex flex-col h-full">
        <div class="text-xl font-bold">{plan.name}</div>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed">
          {plan.description}
        </p>
        <div class="mt-auto pt-4 text-sm text-gray-600">
          Highlights:
          <ul class="list-disc list-inside mt-2 space-y-1">
            {#each plan.features as feature}
              <li class="">{feature}</li>
            {/each}
            <ul></ul>
          </ul>
        </div>
        <div class="pt-8">
          <div class="mt-6 pt-4 flex-1 flex flex-row items-center">
            <a
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary w-[80%] mx-auto"
            >
              {plan.buttontext}
            </a>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<h1 class="text-2xl font-bold text-center mt-24">Frequently Asked Questions</h1>
<div class="flex place-content-center">
  <div class="join join-vertical max-w-xl py-6 mx-auto">
    <div class="collapse collapse-arrow join-item border border-primary">
      <input type="radio" name="faq-accordion" />
      <div class="collapse-title text-lg font-medium">
        Who is the Global Fund dashboard for?
      </div>
      <div class="collapse-content">
        <p>
          This site is designed for anyone who is involved in Global Fund
          oversight, engagement, and advocacy. The information here is meant to
          arm communities with the tools and data they need to ask the right
          questions, advocate for the right solutions, and hold donors
          accountable to the populations they serve.
        </p>
      </div>
    </div>
    <div class="collapse collapse-arrow join-item border border-primary">
      <input type="radio" name="faq-accordion" />
      <div class="collapse-title text-lg font-medium">
        Where do these data come from?
      </div>
      <div class="collapse-content">
        <p>These data mostly come directly from the Global Fund.</p>
      </div>
    </div>
    <div class="collapse collapse-arrow join-item border border-primary">
      <input type="radio" name="faq-accordion" />
      <div class="collapse-title text-lg font-medium">
        What if I have questions or would like support using these resources?
      </div>
      <div class="collapse-content">
        <p>Please reach out to us on our contact page!</p>
      </div>
    </div>
  </div>
</div>

<svg style="display:none" version="2.0">
  <defs>
    <symbol
      id="checkcircle"
      viewBox="0 0 24 24"
      stroke-width="2"
      fill="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-4.105-4.498a.791.791 0 0 0-1.082.29l-3.828 6.63-1.733-2.08a.791.791 0 1 0-1.216 1.014l2.459 2.952a.792.792 0 0 0 .608.285.83.83 0 0 0 .068-.003.791.791 0 0 0 .618-.393L12.6 6.866a.791.791 0 0 0-.29-1.081z"
      />
    </symbol>
  </defs>
</svg>

<svg style="display:none" version="2.0">
  <defs>
    <symbol id="nocircle" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H8a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Z"
      />
    </symbol>
  </defs>
</svg>
