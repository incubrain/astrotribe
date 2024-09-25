<template>
  <div>
    <div v-if="editor">
      <PrimeButton
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        bold
      </PrimeButton>
      <PrimeButton
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        italic
      </PrimeButton>
      <PrimeButton
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        strike
      </PrimeButton>
      <PrimeButton
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
        @click="editor.chain().focus().toggleCode().run()"
      >
        code
      </PrimeButton>
      <PrimeButton @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </PrimeButton>
      <PrimeButton @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('paragraph') }"
        @click="editor.chain().focus().setParagraph().run()"
      >
        paragraph
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        h1
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        h2
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        h3
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        h4
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      >
        h5
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        h6
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        bullet list
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        ordered list
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        code block
      </PrimeButton>
      <PrimeButton
        :class="{ 'is-active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        blockquote
      </PrimeButton>
      <PrimeButton @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </PrimeButton>
      <PrimeButton @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </PrimeButton>
      <PrimeButton
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
      >
        undo
      </PrimeButton>
      <PrimeButton
        :disabled="!editor.can().chain().focus().redo().run()"
        @click="editor.chain().focus().redo().run()"
      >
        redo
      </PrimeButton>
    </div>
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<script setup>
const editor = useEditor({
  content: '<p>I\'m running Tiptap with Vue.js. 🎉</p>',
  extensions: [TiptapStarterKit],
})

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>
