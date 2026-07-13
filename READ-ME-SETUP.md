# Court Case Diary - OneDrive sync + Android/iPad app

Files (keep them all in the SAME folder):
- court-diary.html   (the app)
- manifest.webmanifest
- sw.js              (offline support)
- icon-192.png, icon-512.png, icon-512-maskable.png

## Step 1 - Host on GitHub Pages (needed for sign-in)
Put the files in your GitHub Pages repo. Your page URL will look like:
https://YOURNAME.github.io/REPO/court-diary.html
Open that URL once on each device. Sign-in does NOT work from a file:// copy
or from the OneDrive/Drive preview - it must be the hosted https link.

## Step 2 - One-time Microsoft (OneDrive) setup
1. Azure portal -> Microsoft Entra ID (Azure AD) -> App registrations -> New registration.
2. Name: Court Diary.
   Supported account types: "Accounts in any organizational directory and personal Microsoft accounts".
3. Redirect URI: platform = Single-page application (SPA).
   Enter your page URL exactly, e.g. https://YOURNAME.github.io/REPO/court-diary.html
4. Register. Copy the "Application (client) ID".
5. API permissions -> Add a permission -> Microsoft Graph -> Delegated:
   add Files.ReadWrite.AppFolder and User.Read -> Save.
6. In the app: gear icon -> OneDrive Sync -> paste the client ID -> Save & Connect.
   Sign in with your Microsoft (work) account.

The app then keeps ONE file, court-case-diary.json, in the app folder of your
OneDrive. It loads it on open, auto-saves every change, and pulls the latest copy
whenever you switch back to the app. It can only see its own folder, nothing else
in your OneDrive. The client ID is not a secret.

## Step 3 - Install on each device
- Windows: open the hosted link in Edge or Chrome, click the install icon in the
  address bar to run it in its own window.
- Android: open the link in Chrome -> menu -> Install app / Add to home screen.
  (Or build a real APK for free: paste the link at https://www.pwabuilder.com,
  choose Android, download the signed APK, copy to phone and install.)
- iPad: open the link in Safari -> Share -> Add to Home Screen.

Sign in with the SAME Microsoft account on all three and they stay in sync.

## Moving your existing data in
Open the app, use Import JSON to load your current court-case-diary.json,
then connect OneDrive. The data is written to the OneDrive file and stays synced.

## Notes
- Edit on one device at a time. The last save wins; there is no merge.
- Offline still works: changes are cached and written to OneDrive when back online.
- Google Drive mode and Team mode (multi-user login) are still available in the
  gear dialog if you ever need them.
