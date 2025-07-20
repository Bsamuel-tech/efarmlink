# E-FarmLink Figma Design System Guide

## 🎨 Color Palette

### Primary Colors
- **Primary Green**: `#16A34A` (Green-600)
  - Use for: Main CTAs, farmer buttons, success states
  - Hover state: `#15803D` (Green-700)
  - Light variant: `#DCFCE7` (Green-100) for backgrounds

- **Primary Blue**: `#2563EB` (Blue-600)
  - Use for: Buyer buttons, secondary CTAs, links
  - Hover state: `#1D4ED8` (Blue-700)
  - Light variant: `#DBEAFE` (Blue-100) for backgrounds

### Neutral Colors
- **Gray-900**: `#111827` - Primary text, headings
- **Gray-700**: `#374151` - Secondary text
- **Gray-600**: `#4B5563` - Tertiary text, icons
- **Gray-400**: `#9CA3AF` - Placeholder text, disabled states
- **Gray-200**: `#E5E7EB` - Borders, dividers
- **Gray-100**: `#F3F4F6` - Light backgrounds
- **Gray-50**: `#F9FAFB` - Page backgrounds
- **White**: `#FFFFFF` - Card backgrounds, main content areas

### Status Colors
- **Success**: `#10B981` (Emerald-500) - Available products, completed orders
- **Warning**: `#F59E0B` (Amber-500) - Limited stock, pending orders
- **Error**: `#EF4444` (Red-500) - Errors, unavailable items
- **Info**: `#3B82F6` (Blue-500) - Information, notifications

## 📝 Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Font Sizes & Weights

#### Headings
- **H1**: 48px, Font Weight 700 (Bold)
  - Use for: Main page titles, hero headings
  - Line height: 1.2 (58px)
  - Letter spacing: -0.02em

- **H2**: 36px, Font Weight 700 (Bold)
  - Use for: Section headings, dashboard titles
  - Line height: 1.25 (45px)
  - Letter spacing: -0.01em

- **H3**: 24px, Font Weight 600 (Semibold)
  - Use for: Card titles, subsection headings
  - Line height: 1.33 (32px)

- **H4**: 20px, Font Weight 600 (Semibold)
  - Use for: Component titles, form labels
  - Line height: 1.4 (28px)

#### Body Text
- **Large**: 18px, Font Weight 400 (Regular)
  - Use for: Important descriptions, lead text
  - Line height: 1.56 (28px)

- **Base**: 16px, Font Weight 400 (Regular)
  - Use for: Main body text, form inputs
  - Line height: 1.5 (24px)

- **Small**: 14px, Font Weight 400 (Regular)
  - Use for: Secondary text, captions
  - Line height: 1.43 (20px)

- **Extra Small**: 12px, Font Weight 400 (Regular)
  - Use for: Labels, timestamps, metadata
  - Line height: 1.33 (16px)

#### Special Text
- **Button Text**: 16px, Font Weight 600 (Semibold)
- **Link Text**: 16px, Font Weight 500 (Medium)
- **Price Text**: 16px, Font Weight 700 (Bold) - Use success green color

## 📐 Spacing System (8px Grid)

### Base Unit: 8px
- **4px**: Micro spacing (icon padding)
- **8px**: Small spacing (between related elements)
- **12px**: Medium-small spacing
- **16px**: Medium spacing (standard gap)
- **24px**: Large spacing (section gaps)
- **32px**: Extra large spacing (major sections)
- **48px**: XXL spacing (page sections)
- **64px**: XXXL spacing (hero sections)

### Component Spacing
- **Button Padding**: 12px vertical, 24px horizontal
- **Input Padding**: 12px vertical, 16px horizontal
- **Card Padding**: 24px all sides
- **Container Max Width**: 1280px (7xl)
- **Container Padding**: 16px mobile, 24px tablet, 32px desktop

## 🔘 Buttons

### Primary Button (Farmer)
- **Background**: Green-600 `#16A34A`
- **Text**: White `#FFFFFF`
- **Font**: 16px, Semibold (600)
- **Padding**: 12px vertical, 24px horizontal
- **Border Radius**: 8px
- **Hover**: Green-700 `#15803D`
- **Shadow**: 0 1px 2px rgba(0, 0, 0, 0.05)

### Primary Button (Buyer)
- **Background**: Blue-600 `#2563EB`
- **Text**: White `#FFFFFF`
- **Font**: 16px, Semibold (600)
- **Padding**: 12px vertical, 24px horizontal
- **Border Radius**: 8px
- **Hover**: Blue-700 `#1D4ED8`
- **Shadow**: 0 1px 2px rgba(0, 0, 0, 0.05)

### Secondary Button
- **Background**: White `#FFFFFF`
- **Text**: Gray-700 `#374151`
- **Border**: 1px solid Gray-300 `#D1D5DB`
- **Font**: 16px, Semibold (600)
- **Padding**: 12px vertical, 24px horizontal
- **Border Radius**: 8px
- **Hover**: Gray-50 `#F9FAFB`

## 📱 Cards

### Product Card
- **Background**: White `#FFFFFF`
- **Border**: 1px solid Gray-200 `#E5E7EB`
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: 0 1px 3px rgba(0, 0, 0, 0.1)
- **Hover Shadow**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Width**: 320px (desktop), 100% (mobile)

### Stats Card
- **Background**: White `#FFFFFF`
- **Border**: 1px solid Gray-200 `#E5E7EB`
- **Border Radius**: 12px
- **Padding**: 24px
- **Icon Background**: Colored background (Green-100, Blue-100, etc.)
- **Icon Size**: 24px
- **Number Text**: 32px, Bold (700)

## 🔤 Form Elements

### Input Fields
- **Background**: White `#FFFFFF`
- **Border**: 1px solid Gray-300 `#D1D5DB`
- **Border Radius**: 8px
- **Padding**: 12px vertical, 16px horizontal
- **Font**: 16px, Regular (400)
- **Focus Border**: 2px solid Green-500 `#10B981`
- **Placeholder**: Gray-400 `#9CA3AF`

### Select Dropdowns
- **Same as input fields**
- **Arrow Icon**: Gray-400 `#9CA3AF`
- **Dropdown Background**: White with shadow

## 🖼️ Layout Specifications

### Header
- **Height**: 64px
- **Background**: White `#FFFFFF`
- **Border Bottom**: 1px solid Gray-200 `#E5E7EB`
- **Logo Size**: 32px height
- **Sticky**: Yes (top: 0)

### Navigation Tabs
- **Height**: 48px
- **Background**: Gray-100 `#F3F4F6`
- **Active Tab**: White background with colored text
- **Border Radius**: 6px
- **Padding**: 12px horizontal

### Sidebar (if used)
- **Width**: 280px
- **Background**: White `#FFFFFF`
- **Border Right**: 1px solid Gray-200 `#E5E7EB`

## 📊 Data Display

### Tables
- **Header Background**: Gray-50 `#F9FAFB`
- **Header Text**: 12px, Medium (500), Uppercase, Gray-500
- **Row Height**: 56px
- **Border**: 1px solid Gray-200 `#E5E7EB`
- **Hover**: Gray-50 `#F9FAFB`

### Status Badges
- **Available**: Green-100 background, Green-800 text
- **Limited**: Yellow-100 background, Yellow-800 text
- **Unavailable**: Red-100 background, Red-800 text
- **Padding**: 4px horizontal, 2px vertical
- **Border Radius**: 9999px (full)
- **Font**: 12px, Medium (500)

## 🎯 Icons

### Icon Library: Lucide React
- **Standard Size**: 20px (most icons)
- **Small Size**: 16px (inline icons)
- **Large Size**: 24px (feature icons)
- **Color**: Gray-600 `#4B5563` (default)
- **Hover Color**: Green-600 or Blue-600 (depending on context)

### Common Icons
- **Leaf**: Logo, nature elements
- **Users**: Farmer representation
- **MapPin**: Location, buyer representation
- **MessageCircle**: Chat, communication
- **TrendingUp**: Growth, success
- **Package**: Products, inventory

## 📱 Responsive Breakpoints

### Mobile First Approach
- **Mobile**: 0px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Grid System
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns (depending on content)

## 🎨 Figma Organization Tips

### Page Structure
1. **🎨 Design System** - Colors, typography, components
2. **📱 Mobile Screens** - All mobile layouts
3. **💻 Desktop Screens** - All desktop layouts
4. **🔧 Components** - Reusable components library
5. **🖼️ Assets** - Icons, images, illustrations

### Component Library
Create these as Figma components:
- Button variants (Primary Farmer, Primary Buyer, Secondary)
- Input fields (Text, Select, Textarea)
- Cards (Product, Stats, Message)
- Navigation elements (Header, Tabs)
- Status badges
- Icons with consistent sizing

### Auto Layout Usage
- Use Auto Layout for all buttons, cards, and flexible containers
- Set proper spacing between elements
- Use "Fill container" for responsive behavior

This design system will ensure consistency across your entire E-FarmLink platform and make development much smoother!