# Tracker

Tracking things that slow down production for now, but needs to be fixed later.
Fix bugs in the bugfix branch, and merge onto main.
Whenever we are in a bugfix cycle, pull from main to keep up to date.

## Bugs

- [ ] Document ordering doesn't work on project page.
- [x] Document count and date doesn't work on project dashboard.
- [x] Implemented auto-save feature broke
- [x] Suggestions tracker at the bottom requires more space.
- [ ] Ignored suggestions come back after spellcheck
- [ ] Markdown formatting triggers suggestions; don't do that.
- [ ] Upon accepting changes, spellcheck is run again.
- [ ] Ignore requests are not correctly ignored, they reappear on next check.
- [ ] Document creation says description is optional, but fails to generate with empty description.

## Missing Features

- [ ] Document and Project deletion
- [ ] Confirm leave with unsaved changes.
- [ ] Focus on one paragraph for AI suggestions at a time, or one sentence at a time?
- [ ] Document overview check for logical flow.
- [ ] Tokenize text into paragraphs, sentences, and words.