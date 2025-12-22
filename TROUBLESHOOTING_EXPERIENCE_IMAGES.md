# Troubleshooting Experience Images Not Rendering

## Quick Debugging Steps

### 1. Check Browser Console
Open your browser's developer console (F12) and look for:
- `[Experience] Image debug:` logs showing the image paths
- `[Experience] Image load error:` logs if images fail to load
- Any 404 errors for image files

### 2. Verify Config File
Check your `site.config.json` file and look for experience entries:

```json
{
  "experience": [
    {
      "role": "Software Engineer",
      "company": "Company Name",
      "icon": "assets/experience-0-1234567890.png"  // ← Check this path
    }
  ]
}
```

**What to check:**
- Does `icon` field exist?
- Is it `"assets/..."` or `"/assets/..."` or something else?
- Is the path correct?

### 3. Verify File Location
The image files should be in:
```
your-project/
  public/
    assets/
      experience-0-1234567890.png  ← File should be here
      experience-1-1234567890.png
      ...
```

**To check:**
1. Look in your project's `public/assets/` folder
2. Verify the filenames match what's in the config
3. Make sure files actually exist

### 4. Test Image Path Directly
Try accessing the image directly in your browser:
- If config has: `"icon": "assets/experience-0-1234567890.png"`
- Try: `http://localhost:3000/assets/experience-0-1234567890.png`
- If you see the image → path is correct
- If 404 → file is missing or in wrong location

### 5. Check Normalization
The code converts:
- `assets/experience-0.png` → `/assets/experience-0.png`
- This means Next.js looks for: `public/assets/experience-0.png`

## Common Issues & Solutions

### Issue 1: Blank/No Image
**Symptoms:** Empty circle, no image, no error

**Possible causes:**
1. **File doesn't exist** - Check `public/assets/` folder
2. **Wrong path in config** - Verify `icon` field matches actual filename
3. **Path not normalized** - Should be `assets/...` in config, becomes `/assets/...` in code

**Solution:**
- Ensure files are in `public/assets/` folder
- Verify config has correct path (should start with `assets/`)
- Check browser console for errors

### Issue 2: 404 Error
**Symptoms:** Console shows 404 for image file

**Possible causes:**
1. File not in `public/assets/` folder
2. Filename mismatch between config and actual file
3. File not extracted from ZIP properly

**Solution:**
- Copy image files to `public/assets/` folder
- Ensure filenames match exactly (case-sensitive)
- Re-extract ZIP if needed

### Issue 3: Image Shows in Preview but Not on Page
**Symptoms:** Works in form preview, blank on actual page

**Possible causes:**
1. Preview uses data URLs, page uses file paths
2. Files not in correct location for production
3. Config path different between preview and export

**Solution:**
- Check that exported ZIP has files in `assets/` folder
- Verify extracted files go to `public/assets/`
- Check that config uses `assets/...` paths (not data URLs)

## Manual Test

Add this to your browser console on the page:

```javascript
// Check what the config has
fetch('/site.config.json')
  .then(r => r.json())
  .then(config => {
    console.log('Experience icons:', config.experience.map(e => ({
      company: e.company,
      icon: e.icon
    })));
  });

// Test if image file exists
const testImage = new Image();
testImage.onload = () => console.log('✅ Image exists:', testImage.src);
testImage.onerror = () => console.error('❌ Image missing:', testImage.src);
testImage.src = '/assets/experience-0-1234567890.png'; // Replace with your actual path
```

## Expected Behavior

1. **In Config:** `"icon": "assets/experience-0-1234567890.png"`
2. **After Normalization:** `/assets/experience-0-1234567890.png`
3. **File Location:** `public/assets/experience-0-1234567890.png`
4. **Browser Request:** `http://localhost:3000/assets/experience-0-1234567890.png`

If any step fails, that's where the issue is!

