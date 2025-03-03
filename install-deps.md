# Installing Required Dependencies

To resolve the `date-fns` import error, you need to install the following package:

```bash
npm install date-fns
```

Run this command from the project root directory.

## Why it's needed

The `date-fns` library is used in multiple components:
- `AnnouncementsAdmin.tsx` - For formatting dates in the announcement table
- `Announcements.tsx` - For formatting dates in announcement displays
- `AnnouncementForm.tsx` - For handling dates in the form

## Alternative Solutions

If you can't install the package, you could modify the code to use the built-in JavaScript Date object methods, but this would require changing several components and would result in less consistent date formatting.