# Preeti & Vivek wedding invitation

A static website: `index.html`, `theme.css` and the `images/` folder. No build step is needed.

## Put it on GitHub Pages

1. On github.com, click **New repository**. Name it, for example, `preeti-vivek-wedding`, set it to **Public**, and click **Create repository**.
2. On the new repository page, click **uploading an existing file**. Unzip `preeti-vivek-wedding-site.zip`, then drag in everything inside it: `index.html`, `theme.css`, `.nojekyll`, `README.md` and the whole `images` folder. Click **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**, then click **Save**.
4. Wait a minute or two and refresh the page. GitHub shows your link, which looks like `https://<your-username>.github.io/preeti-vivek-wedding/`.

To update the site later, upload the changed files to the same repository (for a settings change, that is just `index.html`). The site refreshes on its own within a minute or two.

## Optional settings (top of the script in index.html)

- `RSVP_WHATSAPP`: your WhatsApp number with country code, digits only (for example `919876543210`). RSVPs then open a chat with you directly.
- `PHOTOS_URL`: the Google Drive folder link for the **Upload wedding memories** button. In Drive, share the folder as "Anyone with the link" with **Editor** access so guests can add photos. Until it is set, the button says "Photo link coming soon".
- `MUSIC_SRC`: the path of an audio file you have the rights to use, for example `music.mp3`, placed next to `index.html`.

## Personal invitation links

Open your site with `#host` at the end of the link to see the link maker. Type a guest's name to get a link that greets them by name.
