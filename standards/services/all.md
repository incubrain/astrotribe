- when creating a dashboard for the service, use vue, tailwind ^v4.1.0, and defineCustomElement to
  create it as a `web component`
- Dashboards will be injected as web components into our main admin app
- Vue Web Components (defineCustomElement) are rendered inside Shadow DOM, which means:
  - Tailwind’s global styles are not accessible inside the shadow root
  - No styles = broken layout/unstyled component
- To fix this: generate CSS -
  `npx tailwindcss -i ./src/styles/tailwind.css -o ./src/styles/tailwind.generated.css`
- Use Vite’s ?inline to inject the raw CSS string.

```ts
// tailwind.generated.css?inline returns a string
import tailwindCss from './styles/tailwind.generated.css?inline'

const style = document.createElement('style')
style.textContent = tailwindCss

const MyElement = defineCustomElement({
  extends: App,
  styles: [tailwindCss], // this doesn't work on its own for shadow DOM
  shadow: true,
  mounted() {
    this.shadowRoot?.appendChild(style.cloneNode(true))
  },
})
customElements.define('my-element', MyElement)
```
