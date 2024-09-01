<script setup lang="ts">
const props = defineProps({
  bpSection: {
    type: String,
    required: true
  }
})

// fetch the bp section from content
const { error, data: bpMarkdown } = await useAsyncData(`business-plan-${props.bpSection}`, () =>
  queryContent('/bp')
    .where({ section: { $eq: props.bpSection } })
    .findOne()
)

if (error.value) {
  console.error(error.value)
}

console.log('bpMarkdown', bpMarkdown)
</script>

<template>
  <div class="mx-auto overflow-x-hidden p-4 md:p-6">
    <MDC
      :value="bpMarkdown"
      tag="article"
      class="list-item-primary-700 background custom-content prose prose-lg mx-auto w-full rounded-md p-8 marker:h-3 marker:w-3 marker:text-primary-700 prose-headings:no-underline prose-h1:border-b-0 prose-h2:border-b-0 prose-h3:border-b-0 prose-h4:border-b-0 prose-h5:border-b-0 prose-h6:border-b-0"
    />
  </div>
</template>

<style>
.custom-content {
  color: #c8c8c8;
  line-height: 1.6;
  font-family: 'Arial', sans-serif;
  max-width: 700px !important;
}

/* Heading styles */
.custom-content h1,
.custom-content h2,
.custom-content h3,
.custom-content h4,
.custom-content h5,
.custom-content h6 {
  color: #0d7daa;
}

.custom-content h1 a,
.custom-content h2 a,
.custom-content h3 a,
.custom-content h4 a,
.custom-content h5 a,
.custom-content h6 a {
  font-weight: bold;
  color: #0d7daa;
  text-decoration: none !important;
}

/* Bold text */
.custom-content strong {
  color: #957137;
}

/* List items */
.custom-content li {
  color: #c8c8c8;
 
}

.custom-content ul {
  list-style-type: none;
}

.custom-content ul li::before {
  content: "💡";  /* You can use any character or emoji here */
  color: #f2f4f6;  /* Choose your desired color */
  display: inline-block;
  width: 1em;
  margin-left: -1em;
  margin-right: 0.5em;
}

li::marker {
  color: rgb(255, 255, 255) !important;
}

/* Override max-width for specific elements */
.custom-content > table,
.custom-content > img {
  background-color: #1e1e1e;
  max-width: none !important;
  width: auto !important;
  position: relative !important;
  margin-left: -30% !important;
  margin-right: -30% !important;
}

.custom-content table {
  display: block;
  overflow-x: auto;
  white-space: nowrap;
  border-collapse: separate;
  border-spacing: 0;
  margin: 2em 0;
}

.custom-content th,
.custom-content td {
  min-width: 120px;
  padding: 12px 16px;
  border: 1px solid #1a1a1a;
  text-align: left;
}

.custom-content th {
  background-color: #79bbdd82;
  font-weight: bold;
}

.custom-content tr:nth-child(even) {
  background-color: #67676731;
}

.custom-content pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 1em;
  font-family: 'Consolas', 'Monaco', monospace;
}

.custom-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 2em auto;
}

@media (max-width: 640px) {
  .custom-content {
    font-size: 16px;
  }
}
</style>
