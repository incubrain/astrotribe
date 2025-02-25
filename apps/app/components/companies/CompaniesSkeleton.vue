<template>
  <table
    class="min-w-full select-none border-collapse text-primary-500 table-auto bg-transparent rounded-lg"
  >
    <tbody>
      <!-- Repeat Skeleton Rows for a Loading Effect -->
      <tr
        v-for="index in 5"
        :key="index"
        class="relative p-5 mt-1 mb-1 border border-primary-500 rounded-xl gap-2 shadow-md bg-gray-800 animate-pulse"
      >
        <!-- Logo Skeleton -->
        <td class="px-4 py-3 text-center">
          <PrimeSkeleton
            shape="circle"
            width="50px"
            height="50px"
            class="rounded-full"
          />
        </td>

        <!-- Company Name Skeleton -->
        <td class="px-4 py-3">
          <PrimeSkeleton
            width="120px"
            height="76px"
          />
        </td>

        <!-- Description Skeleton -->
        <td class="px-4 py-3 whitespace-wrap max-w-xs text-center">
          <PrimeSkeleton
            width="200px"
            height="12px"
            class="mb-2"
          />
          <PrimeSkeleton
            width="180px"
            height="12px"
          />
        </td>

        <!-- Government Badge Skeleton -->
        <td class="absolute top-2 right-2 p-2">
          <PrimeSkeleton
            width="60px"
            height="20px"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
