# Portfolio site

A personal portfolio for projects, certifications and awards. It's a plain static site
(HTML, CSS and JavaScript), so there's nothing to install and no build step.

## View it

Double-click `index.html` to open it in your browser.

## Add or change content

All content lives in **`js/content.js`**. You don't need to touch the other files.

- **Profile**: name, headline, intro, email, links and About text.
- **Projects**: copy one `{ ... }` block inside `projects: [ ... ]` and edit it.
  Projects show in the order you list them.
- **Certifications** and **Awards**: same idea. They're sorted by date automatically.

Watch the commas: each `{ ... }` block in a list needs a comma after it, except the last one.

### Adding images and certificate files

1. Put the file in the right folder:
   - Project screenshots: `assets/projects/`
   - Certificate PDFs or images: `assets/certificates/`
   - Your résumé: `assets/resume.pdf`
2. Point to it from `content.js`, for example
   `cover: "assets/projects/harbor-cover.png"` or
   `file: "assets/certificates/aws-saa.pdf"`.

A project without a `cover` gets a colored mockup thumbnail from its `colors` and `mock` fields.
Screenshots look best at a 16:10 ratio (for example 1600 × 1000 px).

Certificate images (PNG, JPG, WEBP) show inside the detail view. PDFs open in a new tab.

## Publish it online (free)

Any static host works. Two easy options:

- **Netlify Drop**: go to https://app.netlify.com/drop and drag this whole folder onto the page.
- **GitHub Pages**: push this folder to a GitHub repository, then turn on
  *Settings → Pages → Deploy from branch*.

## Files

```
index.html          page structure
css/styles.css      design (colors, fonts, layout)
js/content.js       YOUR CONTENT
js/main.js          builds the page from content.js
assets/             your images, certificates and résumé
```
