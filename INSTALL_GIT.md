# 📥 Install Git on Windows

## Quick Install (5 minutes)

### Step 1: Download Git

1. **Go to:** [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. **Click:** "Click here to download" (64-bit version)
3. **Wait** for download to complete

### Step 2: Install Git

1. **Run** the downloaded file: `Git-2.xx.x-64-bit.exe`
2. **Click "Next"** through all screens (keep default settings)
3. **Important screens:**
   - ✅ "Select Components" → Keep defaults
   - ✅ "Choosing the default editor" → Keep Vim or select Notepad
   - ✅ "Adjusting your PATH" → Select "Git from the command line and also from 3rd-party software"
   - ✅ Click "Next" until "Install"
4. **Click "Install"**
5. **Wait** 1-2 minutes
6. **Click "Finish"**

### Step 3: Verify Installation

1. **Close** any open Command Prompt windows
2. **Open** new Command Prompt
3. **Type:**
   ```bash
   git --version
   ```
4. **You should see:** `git version 2.xx.x`

✅ **Git is installed!**

---

## Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

---

## Now You Can Deploy!

Go back to the `git` folder and follow `DEPLOY_COMMANDS.txt`

---

## Alternative: Use GitHub Desktop (No Command Line)

If you prefer a visual interface:

1. **Download:** [desktop.github.com](https://desktop.github.com)
2. **Install** GitHub Desktop
3. **Sign in** with GitHub account
4. **Add** your project folder
5. **Publish** to GitHub
6. **Deploy** on Render by connecting the repository

---

## Still Don't Want to Install Git?

No problem! Follow `DEPLOY_WITHOUT_GIT.md` for alternative methods.
