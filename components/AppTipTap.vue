<template>
  <div>
    <div v-if="editor">
      <PrimeButton
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        bold
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        italic
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        strike
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        code
      </PrimeButton>
      <PrimeButton @click="editor.chain().focus().unsetAllMarks().run()"> clear marks </PrimeButton>
      <PrimeButton @click="editor.chain().focus().clearNodes().run()"> clear nodes </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
      >
        paragraph
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        h1
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        h2
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        h3
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
      >
        h4
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
      >
        h5
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
      >
        h6
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        bullet list
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        ordered list
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        code block
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        blockquote
      </PrimeButton>
      <PrimeButton @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </PrimeButton>
      <PrimeButton @click="editor.chain().focus().setHardBreak().run()"> hard break </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        undo
      </PrimeButton>
      <PrimeButton
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        redo
      </PrimeButton>
    </div>
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<script setup>
const editor = useEditor({
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [TiptapStarterKit]
})

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>
