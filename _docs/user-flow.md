# User Flow Documentation

## Overview
This document defines the complete user journey through WordWise, a writing assistant for STEM graduate students. The flow covers both Phase 1 (Core Grammarly Clone) and Phase 2 (AI Enhancement) features.

## Authentication Flow

### 1. Initial Access
- User visits WordWise application
- Redirected to authentication page
- Two authentication options:
  - Email/Password registration/login
  - Google OAuth

### 2. Registration Process
- User enters email and password (or uses Google OAuth)
- Account created successfully
- Redirected to onboarding or dashboard

### 3. Login Process
- User enters credentials
- Authentication successful
- Redirected to dashboard

### 4. Profile Setup (Optional)
- User can access profile settings from dashboard
- Add academic information:
  - Field of study
  - Institution
  - Academic level
- Save profile information

## Main Application Flow

### 1. Dashboard
- **Landing page after authentication**
- Overview of user's projects
- Quick access to recent documents
- Create new project button
- Profile settings access
- Data export option

### 2. Project Management

#### 2.1 Create New Project
- Click "Create New Project" button
- Enter project name
- Enter project description (optional)
- Select project type (dissertation, research paper, etc.)
- Save project
- Redirected to project view

#### 2.2 Project View
- Display project information
- List of documents in the project
- Create new document button
- Project settings
- Export project option

#### 2.3 Edit Project
- Modify project name/description
- Delete project (with confirmation)
- Archive project

### 3. Document Management

#### 3.1 Create New Document
- From project view, click "Create New Document"
- Enter document title
- Select document type (chapter, section, etc.)
- Choose template (Phase 2 feature)
- Create document
- Redirected to document editor

#### 3.2 Document Editor
- **Primary workspace for writing**
- Full-screen text editor
- Auto-save functionality (every 30 seconds)
- Manual save option
- Version history access
- Export document options

#### 3.3 Document Features

##### Real-time Grammar & Spell Checking
- **Spelling errors**: Red underlines
- **Grammar errors**: Blue highlights
- **Style suggestions**: Green highlights
- **Other suggestions**: Orange highlights with appropriate icons
- **Hover interactions**: Popup with detailed information and suggestions
- **Sidebar**: Overview of all current suggestions with categories

##### AI Enhancement Features (Phase 2)
- **Context-aware suggestions**: Opt-in feature
- **Personalized recommendations**: Based on user profile and writing goals
- **Advanced style analysis**: Beyond rule-based corrections
- **AI suggestions**: Follow same visual pattern as regular suggestions

#### 3.4 Document Actions

##### Save Operations
- **Auto-save**: Automatic every 30 seconds
- **Manual save**: User-initiated saves
- **Version history**: Tracks manual saves and recent auto-saves
- **Save indicators**: Visual feedback for save status

##### Version Management
- Access version history from document editor
- View list of saved versions with timestamps
- Restore previous versions
- Compare versions (Phase 2 feature)

##### Export Options
- **DOCX format**: Microsoft Word compatible
- **LaTeX format**: Academic publishing format
- **Plain text**: Simple text format
- Export dialog with format selection

### 4. Sidebar Features

#### 4.1 Suggestions Panel
- **Overview of all current suggestions**
- **Categorized by type**:
  - Spelling errors
  - Grammar errors
  - Style suggestions
  - AI recommendations (Phase 2)
- **Click to navigate** to specific suggestions in text
- **Bulk actions**: Accept all, ignore all by category
- **Filter options**: By severity, type, or status

#### 4.2 Document Statistics
- Word count
- Character count
- Reading time estimate
- Readability score
- Grammar score
- Style score

### 5. Settings & Preferences

#### 5.1 User Profile
- Edit academic information
- Update email/password
- Manage Google OAuth connection
- Delete account option

#### 5.2 Application Preferences
- **Editor preferences**:
  - Font size and family
  - Theme (light/dark mode)
  - Auto-save frequency
- **Grammar checking preferences**:
  - Enable/disable specific rule types
  - Customize suggestion sensitivity
- **AI features preferences** (Phase 2):
  - Enable/disable context-aware suggestions
  - Set writing goals and preferences
  - Manage AI usage settings

### 6. Data Management

#### 6.1 Export User Data
- Access from dashboard or profile settings
- Export all user data:
  - User preferences
  - All projects
  - All documents
  - Version history
- Download as ZIP file
- Include data format documentation

#### 6.2 Import User Data (Future Consideration)
- Upload previously exported data
- Merge with existing data or replace
- Conflict resolution for duplicate projects/documents

## Error Handling & Edge Cases

### 1. Network Issues
- **Offline mode**: Continue editing with local storage
- **Sync when online**: Upload changes when connection restored
- **Conflict resolution**: Handle simultaneous edits

### 2. Authentication Issues
- **Session expiry**: Redirect to login
- **Invalid credentials**: Clear error messages
- **OAuth failures**: Fallback to email/password

### 3. Save Failures
- **Auto-save failure**: Retry mechanism
- **Manual save failure**: Clear error message with retry option
- **Version history corruption**: Backup and recovery options

### 4. AI Service Issues (Phase 2)
- **LLM service down**: Graceful degradation to rule-based checking
- **Rate limiting**: Queue suggestions and process when available
- **Invalid responses**: Fallback to standard suggestions

## User Journey Scenarios

### Scenario 1: New User Writing Dissertation
1. Register with email/password
2. Create "Dissertation" project
3. Create "Introduction" document
4. Write content with real-time feedback
5. Save manually at key milestones
6. Export as DOCX for advisor review

### Scenario 2: Experienced User with AI Features
1. Login to existing account
2. Enable AI enhancement features
3. Open existing research paper
4. Receive context-aware suggestions
5. Compare document versions
6. Export final version in LaTeX format

### Scenario 3: Data Backup
1. Access profile settings
2. Export all user data
3. Download backup file
4. Store securely for future use

## Navigation Structure

### Primary Navigation
- **Dashboard**: Home and project overview
- **Projects**: Project management
- **Documents**: Document editing
- **Profile**: User settings and preferences

### Secondary Navigation
- **Help/Support**: Documentation and assistance
- **Settings**: Application preferences
- **Export**: Data backup options

## Success Metrics

### User Engagement
- Time spent in editor
- Number of documents created
- Frequency of saves and exports

### Feature Adoption
- AI features usage (Phase 2)
- Template usage (Phase 2)
- Version comparison usage (Phase 2)

### User Satisfaction
- Suggestion acceptance rate
- Export frequency
- Return user rate 