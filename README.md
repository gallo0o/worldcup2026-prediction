# ⚽ World Cup 2026 Prediction Game

Look and play around with the resulting webpage (please, don't send predictions, do anything you like but that!) here:

https://jjimenezgarcia.github.io/worldcup2026-prediction/

<img width="1332" height="896" alt="image" src="https://github.com/user-attachments/assets/73932cae-5116-4385-9be8-7081222f8f3d" />
<img width="1332" height="896" alt="image" src="https://github.com/user-attachments/assets/eff4352d-5e79-4568-b73f-8c314827bde7" />
<img width="1317" height="266" alt="image" src="https://github.com/user-attachments/assets/fe87e5fb-102f-4a0f-9639-7ba51341de92" />
<img width="1257" height="749" alt="image" src="https://github.com/user-attachments/assets/7648a827-2927-4dfe-8d56-01c57e586ec6" />


A very serious and enterprise-grade football prediction platform made with cutting-edge technologies such as:

- AI-generated code
- Blind faith

Just to make dumb bets with your friends during the 2026 World Cup.

That’s it.

---

## Disclaimer

I have not really read most of this code.

An AI (multiple) wrote basically all of it, I glued some things together, pressed save, and somehow it works.  
If you open the source and find horrors beyond human comprehension: yes, expected.

There is almost certainly:

- Duplicated code
- Bad formatting
- Weird variable names
- Functions doing 14 things at once
- CSS crimes
- Questionable architecture
- Things that should absolutely not work but somehow do

And honestly? I do not care.

Use it if you want.  
Fork it if you want.  
Judge me if you want.

---

## What does it do?

- Lets people predict:
  - Group stage standings
  - Best 3rd place teams
  - Knockout bracket
  - Individual awards
- Saves predictions to a Google Sheet
- Displays a leaderboard
- Probably breaks in Internet Explorer (good)

---

## How to use your own Google Sheet

If you want to use this for your own friend group:

### 1. Fork the repo

Click the big scary fork button.

---

### 2. Create your own Google Sheet

Make a sheet with whatever structure the current one uses.

Then:

- `File`
- `Share`
- `Publish to web`
- Publish as **CSV**

Google Sheets will give you a public CSV URL.

---

### 3. Replace my Google Sheet URL

Somewhere in the JavaScript there’s a hardcoded URL pointing to my sheet.

Replace it with yours.

It is at the top of `app.js`, you need to modify all 3 variables.

---

## Tech Stack

- HTML
- CSS
- JavaScript
- Poor decisions

---

## Known Issues

- Yes
- Probably many
- Don't ask me
- If something breaks just say it’s “dynamic”

---

## License

Do whatever you want with it.

If it explodes in production during the World Cup final and your friends accuse you of rigging the leaderboard, that’s on you.

---

*Even this README was written by an AI. Imagine what the code looks like.*
