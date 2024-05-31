<script setup lang="ts">
const chunksStore = useChunksStore()
const { flaggedChunks } = storeToRefs(chunksStore)

const confirm = useConfirm()

const confirmDelete = (chunkId: number) => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      chunksStore.deleteChunk(chunkId)
    },
    reject: () => {}
  })
}
</script>
<template>
  <div>
    <AdminChunksHeader>
      <PrimeButton @click="chunksStore.fetchChunks(true)"> Get Chunks </PrimeButton>
    </AdminChunksHeader>
    <div
      v-if="flaggedChunks.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminChunksCard
        v-for="doc in flaggedChunks"
        :key="doc.id"
        :doc="doc"
      >
        <template #header>
          <PrimeConfirmDialog></PrimeConfirmDialog>

          <PrimeButton
            @click="chunksStore.flagChunk(doc.id, doc.is_flagged)"
            outlined
          >
            Unflag
          </PrimeButton>
          <PrimeButton
            @click="confirmDelete(doc.id)"
            severity="danger"
            outlined
          >
            Delete
          </PrimeButton>
        </template>
      </AdminChunksCard>
    </div>
  </div>
</template>

<style scoped></style>
